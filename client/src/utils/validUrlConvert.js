export const validUrlConvert = (name) => {
    const url = name?.toString().replaceAll(" ","-").replaceAll(",","-").replaceAll("&","-")
    return url
}
