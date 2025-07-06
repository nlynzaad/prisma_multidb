export const dbProviders = ['mysql','postgresql','sqlite'] as const

export type DBProvider = typeof dbProviders[number]
