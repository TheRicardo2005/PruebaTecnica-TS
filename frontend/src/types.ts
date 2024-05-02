export type Data = Array<Record<string,string>>

export type ApiUploadResponse = {
    message: string,
    data: Data
}

export type ApiSearchResponse = {
    data: Data
}