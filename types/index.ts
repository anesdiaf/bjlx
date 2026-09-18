export type ActionResult<T = void> =
    | { success: true, data?: any }
    | { success: false, error: string }
