const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'tr'],
  directory: path.join(__dirname, '../locales'),
  defaultLocale: 'en'
});

module.exports = {
    getIndexPage: (req, res) => {
        const locale = req.params.locale || 'tr';
        req.session.locale = locale;
        const welcomeMessage = i18n.__({ phrase: 'welcome_message', locale });
        res.render('index', { welcomeMessage, aboutUs: i18n.__({ phrase: 'about_us', locale }) });
      },
      

  getAboutUsPage: (req, res) => {
    const locale = req.session.locale || 'en';
    res.render('about', { 
      aboutUsTitle: i18n.__({ phrase: 'about_us_title', locale }),
      aboutUsContent: i18n.__({ phrase: 'about_us_content', locale })
    });
  },

  getContactPage: (req, res) => {
    const locale = req.session.locale || 'en';
    res.render('contact', { 
      contactTitle: i18n.__({ phrase: 'contact_title', locale }),
      contactFormPlaceholder: i18n.__({ phrase: 'contact_form_placeholder', locale }),
      submitButtonText: i18n.__({ phrase: 'submit_button_text', locale })
    });
  }
  
};
