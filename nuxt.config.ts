// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app: {
        head: {
            title: 'CHIO Architects',
            htmlAttrs: {
            lang: 'en'
            },
            meta: [
            { name: 'viewport', content: 'width=device-width, initial-scale=1' }
            ],
            noscript: [
            { children: 'Javascript is required' }
            ]
        }
    },
    modules: [
    '@nuxtjs/tailwindcss'
    ],
})
