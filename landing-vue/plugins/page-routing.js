export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.$router.options.scrollBehavior = (to, from, savedPosition) => {
        if (savedPosition) {
            return {
                ...savedPosition,
                behavior: 'smooth',
            };
        } else if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
                top: 150
            }
        }
    }
})