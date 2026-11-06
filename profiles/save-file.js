export async function saveJsonFile(name, text) {
    const file = new File([text], name, { type: "application/json" });
    if (matchMedia("(pointer: coarse)").matches && navigator.canShare?.({ files: [file] })) {
        try {
            await navigator.share({ files: [file] });
            return "saved";
        }
        catch (error) {
            if (error instanceof DOMException && error.name === "AbortError")
                return "cancelled";
        }
    }
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = name;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
    return "saved";
}
