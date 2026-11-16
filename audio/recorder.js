export const RECORDING_TYPES = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus", "audio/webm"];
export function pickRecordingType(isSupported) {
    return RECORDING_TYPES.find((type) => isSupported(type));
}
export async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const type = pickRecordingType((t) => MediaRecorder.isTypeSupported(t));
    const recorder = new MediaRecorder(stream, type === undefined ? {} : { mimeType: type });
    const chunks = [];
    recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0)
            chunks.push(event.data);
    });
    recorder.start();
    return {
        stop: () => new Promise((resolve, reject) => {
            recorder.addEventListener("stop", () => {
                for (const track of stream.getTracks())
                    track.stop();
                resolve(new Blob(chunks, { type: recorder.mimeType || chunks[0]?.type || "" }));
            }, { once: true });
            recorder.addEventListener("error", () => reject(new Error("recording failed")), { once: true });
            recorder.stop();
        }),
    };
}
