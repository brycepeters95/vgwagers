const PasswordReset = require('../models/PasswordReset')

module.exports = {
    cron: function cron(ms, fn) {
      function cb() {
        clearTimeout(timeout);
        timeout = setTimeout(cb, ms);
        fn();
      }
      let timeout = setTimeout(cb, ms);
      return () => {};
    },
    removeExpiredPasswordLinks: async function removeExpiredPasswordLinks() {
        const currDate = Date.now();
        try {
            const links = await PasswordReset.find({ ttl: { $lt: currDate } });
            links.forEach(async (link) => {
                try {
                    await PasswordReset.findByIdAndDelete(link.id, (err) => {
                        if (err) {
                          throw err;
                        } else {
                          console.log('Deleted');
                        }
                      });
                } catch (err) {
                    console.log(err);
                }
            });
        } catch (err) {
            console.log(err);
        }

    }
};
remove_expired_links.js