module.exports = ({ env }) => ({
    // ...
    upload: {
      config: {
        provider: 'cloudinary',
        providerOptions: {
          cloud_name: env('CLOUDINARY_NAME'),
          api_key: env('CLOUDINARY_KEY'),
          api_secret: env('CLOUDINARY_SECRET'),
        },
        actionOptions: {
          upload: {},
          delete: {},
        },
      },
    },
    email: {
      config: {
        provider: 'sendgrid',
        providerOptions: {
          apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
          defaultFrom: 'rosmis123@gmail.com',
          defaultReplyTo: 'rosmis123@gmail.com',
        },
      },
    },
    ezforms:{
      config:{
        captchaProvider: {
          name: 'none',
        },
        notificationProviders: [],
        enableFormName: true
      }
  }
    // ...
  });