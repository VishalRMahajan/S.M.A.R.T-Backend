export type THTTPResposne = {
    success: boolean
    statusCode: number
    timeStamp?: string | null
    request: {
        method: string
        url: string
    }
    message: string
    data: unknown
}

export type THTTPError = {
    success: boolean
    statusCode: number
    timeStamp?: string | null
    request: {
        method: string
        url: string
    }
    message: string
    trace?: object | null
}
