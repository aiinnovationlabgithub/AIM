// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
        },
        {
          rel: 'stylesheet',
          href: 'https://cdn.datatables.net/2.1.8/css/dataTables.dataTables.min.css'
        }
      ],
      script: [
        // 確保先加載 jQuery
        {
          src: 'https://code.jquery.com/jquery-3.6.0.min.js',
          defer: true,
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
          defer: true,
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/chart.js',
          defer: true,
        },
        {
          // 引入 chartjs-plugin-datalabels 插件
          src: 'https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels',
          defer: true,
        },
        {
          src: 'https://cdn.datatables.net/2.1.8/js/dataTables.min.js',
          defer: true,
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/datatables.net-bs5@1.13.5/js/dataTables.bootstrap5.min.js',
          defer: true,
        },
        {
          src: 'https://cdn.jsdelivr.net/npm/sweetalert2@latest',
          defer: true
        }
      ],
    },
  },
})
