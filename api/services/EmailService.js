'use strict';
const mailer = require('nodemailer');
const redis = require("redis");
const crypto = require("crypto");
const Mailgun = require('mailgun-js');
const Entities = require('html-entities').AllHtmlEntities;
const entities = new Entities();
const client = redis.createClient({ host: sails.config.custom.redis.host });
client.on("error", function (err) {
  sails.log.error(err);
});

let transporter;

// Create transporter
if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
  transporter = new Mailgun({
    apiKey: sails.config.custom.mailgun.key,
    domain: sails.config.custom.mailgun.domain
  });
} else {
  transporter = mailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: "miroljub902@gmail.com",
      pass: "Password1119!!!("
    },
    requireTLS: true
  });
}

class Email {
  constructor (emails) {
    this.options = {
      from: sails.config.custom.mail.from
    };

    if (_.isArray(emails)) {
      this.options.bcc = emails;
      this.options.to = 'dev@redvike.com';
    } else {
      this.options.to = emails;
    }
    return this;
  }

  __send () {
    return new Promise((resolve, reject) => {
      if(process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
        // Add "cc".

        if (process.env.NODE_ENV === 'production') {
          this.options.cc = 'contact@elevatedliving.com';
        }

        transporter.messages().send(this.options, err => {
          if (err) return reject(err);
          return resolve();
        });
      } else {
        transporter.sendMail(this.options, err => {
          if (err) return reject(err);

          return resolve();
        });
      }
    });
  }

  activateAccount () {
    return new Promise((resolve, reject) => {

      this._generateUserHash(this.options.to, 'activate_')
        .then(_hash => {
          this.options.subject = 'Welcome to Elevated Living. Activate account';
          this.options.text = `Link to activate account: ${sails.config.custom.mail.activate}${this.options.to}/${_hash}`;
          this.options.html = `Link to activate account: <a href="${sails.config.custom.mail.activate}${this.options.to}/${_hash}">${sails.config.custom.mail.activate}${this.options.to}/${_hash}<a>`;

          return this.__send()
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);
    });
  }

  resetPassword () {
    return new Promise((resolve, reject) => {

      this._generateUserHash(this.options.to, 'pass_')
        .then(_hash => {
          this.options.subject = 'Request for reset password to Elevated Living app';
          this.options.text = `Link to reset password: ${sails.config.custom.mail.password}${this.options.to}/${_hash}`;
          this.options.html = `Link to reset password: <a href="${sails.config.custom.mail.password}${this.options.to}/${_hash}">${sails.config.custom.mail.password}${this.options.to}/${_hash}<a>`;

          return this.__send()
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);

    });
  }

  activateStaff () {
    return new Promise((resolve, reject) => {

      this._generateUserHash(this.options.to, 'pass_')
        .then(_hash => {
          this.options.subject = 'Welcome in Elevated Living';
          this.options.text = `Link to reset password: ${sails.config.custom.mail.password}${this.options.to}/${_hash}`;
          this.options.html = `Link to reset password: <a href="${sails.config.custom.mail.password}${this.options.to}/${_hash}">${sails.config.custom.mail.password}${this.options.to}/${_hash}<a>`;

          return this.__send()
            .then(resolve)
            .catch(reject);
        })
        .catch(reject);

    });
  }

  canceledTraining (training, doer) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Training was canceled';
      this.options.text = 'The training, which was scheduled to take place on ' + new Date(training.date).toDateString() + ', was canceled by' + doer || training.mainClient;
      this.options.html = 'The training, which was scheduled to take place on ' + new Date(training.date).toDateString() + ', was canceled by' + doer || training.mainClient;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  fourLeft (client, productName) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Billing Alert';
      this.options.text = `Account running low on ${productName}. Dear ${client.user.firstName} ${client.user.lastName}, this is a friendly reminder that your account is running low on sessions. As of ${new Date().toDateString()} you have 4 ${productName} left to use`;
      this.options.html = `Account running low on ${productName}. Dear ${client.user.firstName} ${client.user.lastName}, this is a friendly reminder that your account is running low on sessions. As of ${new Date().toDateString()} you have 4 ${productName} left to use`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  oneLeft (client, productName) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Billing Alert';
      this.options.text = `One ${productName} left. Dear ${client.user.firstName} ${client.user.lastName} you have one ${productName} left out of your package. Please visit the online store at your earliest convenience to avoid service disruptions.`;
      this.options.html = `One ${productName} left. Dear ${client.user.firstName} ${client.user.lastName} you have one ${productName} left out of your package. Please visit the online store at your earliest convenience to avoid service disruptions.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  zeroLeft (client, productName) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Billing Alert';
      this.options.text = `You have zero ${productName} remaining on your account. Please visit the store and add more sessions to continue services.`;
      this.options.html = `You have zero ${productName} remaining on your account. Please visit the store and add more sessions to continue services.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  minusOneLeft (client, productName, trainer, date) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Billing Alert';
      this.options.text = `You have a ${productName} scheduled with ${trainer.user.firstName} ${trainer.user.lastName} on ${new Date(date).toDateString()} but don't have any available sessions left to use. Please visit the store to add more sessions to your account.`;
      this.options.html = `You have a ${productName} scheduled with ${trainer.user.firstName} ${trainer.user.lastName} on ${new Date(date).toDateString()} but don't have any available sessions left to use. Please visit the store to add more sessions to your account.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  sendGift (data) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Congratulations - you have received a gift card';
      this.options.text = `Dear ${data.recipient},<br /><br />Congratulations - you have received a gift card with a ${data.gift.value} that can be redeemed with Elevated Living.<br />Please contact Elevated Living at <a href="mailto:hello@elevatedliving.com">hello@elevatedliving.com</a> to redeem your gift card or call 312-852-6570<br /><br />Thank you,<br />Elevated Living Team`;
      this.options.html = `Dear ${data.recipient},<br /><br />Congratulations - you have received a gift card with a ${data.gift.value} that can be redeemed with Elevated Living.<br />Please contact Elevated Living at <a href="mailto:hello@elevatedliving.com">hello@elevatedliving.com</a> to redeem your gift card or call 312-852-6570<br /><br />Your gift Message:<br />${data.message}<br /><br />Your gift code: <b>${data.gift.hash}</b><br /><br />Thank you,<br />Elevated Living Team`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  confirmGift (data) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Gift - confirm';
      this.options.text = `Your gift code: ${data.gift.hash}. Message to friend:${data.message}`;
      this.options.html = `Your gift code: ${data.gift.hash}<br />Message to friend:<br />${data.message}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  notifyGiftManager (data) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - someone buy a gift';
      this.options.text = `${new Date()}: ${data.clientName} living at ${data.clientAddress} purchased a ${data.gift.value} gift card for ${data.recipient}`;
      this.options.html = `${new Date()}: ${data.clientName} living at ${data.clientAddress} purchased a ${data.gift.value} gift card for <a href="mailto:${data.recipient}">${data.recipient}</a>`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  confirmAssessment () {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Complimentary Fitness Assessment';
      this.options.text = `Thank you for requesting a complimentary fitness assessment. One of our fitness specialists will get in touch with you shortly to provide more information! If you have any questions, you can also email us at <a href="mailto:hello@elevatedliving.com">hello@elevatedliving.com</a>.`;
      this.options.html = `Thank you for requesting a complimentary fitness assessment. One of our fitness specialists will get in touch with you shortly to provide more information! If you have any questions, you can also email us at <a href="mailto:hello@elevatedliving.com">hello@elevatedliving.com</a>.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  notifyAssessment (data) {
    return new Promise((resolve, reject) => {
      this.options.subject = `Complimentary assessment - ${data.clientName}`;
      this.options.text = `${new Date()}: ${data.clientName} living at ${data.clientAddress} is interested in scheduling a free fitness assessment. Email: ${data.clientEmail}. Phone Number: ${data.clientPhone}`;
      this.options.html = `${new Date()}: ${data.clientName} living at ${data.clientAddress} is interested in scheduling a free fitness assessment.<br />Email: ${data.clientEmail}<br />Phone Number: ${data.clientPhone}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  remindAppointment (client, productName) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Registration reminder';
      this.options.text = `Dear ${client.user.firstName} ${client.user.lastName}, just a friendly reminder that you have an upcoming appointment for ${productName} today.`;
      this.options.html = `Dear ${client.user.firstName} ${client.user.lastName}, just a friendly reminder that you have an upcoming appointment for ${productName} today.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  confirmRegistration (client, productName, timestamp) {
    return new Promise((resolve, reject) => {
      const dateString = new Date(timestamp).toDateString();
      this.options.subject = 'Elevated Living - Registration Confirmation';
      this.options.text = `Dear ${client.user.firstName} ${client.user.lastName}, this email is to confirm your registration for ${productName} on ${dateString}. Please email hello@elevatedliving.com for any questions.`;
      this.options.html = `Dear ${client.user.firstName} ${client.user.lastName}, this email is to confirm your registration for ${productName} on ${dateString}. lease email <a href="mailto:hello@elevatedliving.com?Subject=Registration%20question" target="_top">hello@elevatedliving.com</a> for any questions.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  remindAppointmentTrainer (trainer, productName, timestamp) {
    return new Promise((resolve, reject) => {
      const date = new Date(timestamp);
      const dateString = `${date.getHours()}:${date.getMinutes()<10 ? '0' : ''}${date.getMinutes()}`;
      this.options.subject = 'Elevated Living - Registration reminder';
      this.options.text = `Dear ${trainer.user.firstName} ${trainer.user.lastName}, don't forget you have ${productName} scheduled today at ${dateString}`;
      this.options.html = `Dear ${trainer.user.firstName} ${trainer.user.lastName}, don't forget you have ${productName} scheduled today at ${dateString}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  oneLeftManager (clientNames) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Billing';
      this.options.text = `The following clients have one session remaining on their account.\n${clientNames}`;
      this.options.html = `The following clients have one session remaining on their account.<br />${clientNames.split('\n').join('<br/>')}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  withoutMeasurements (clientNames) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Reminders';
      this.options.text = `The following ACTIVE clients haven't had their measurements updated in 30 days.\n${clientNames}`;
      this.options.html = `The following ACTIVE clients haven't had their measurements updated in 30 days.<br />${clientNames.split('\n').join('<br/>')}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  firstVisit (trainer, clientNames) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - First visit follow up reminder';
      this.options.text = `The following clients had their first visit with ${trainer.user.firstName} ${trainer.user.lastName} today.\n${clientNames}`;
      this.options.html = `The following clients had their first visit with ${trainer.user.firstName} ${trainer.user.lastName} today.<br />${clientNames.split('\n').join('<br/>')}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  oneWeekManager (clientNames) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - One week follow up reminder';
      this.options.text = `The following clients have completed their first 7 days with Elevated Living. Please follow up.\n${clientNames}`;
      this.options.html = `The following clients have completed their first 7 days with Elevated Living. Please follow up.<br />${clientNames.split('\n').join('<br/>')}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  oneMonthManager (clientNames) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - 30 days follow up reminder';
      this.options.text = `The following clients have completed their first 30 days with Elevated Living. Please follow up.\n${clientNames}`;
      this.options.html = `The following clients have completed their first 30 days with Elevated Living. Please follow up.<br />${clientNames.split('\n').join('<br/>')}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  fourLeftAdmin (clientNames, productName, timestamp) {
    return new Promise((resolve, reject) => {
      const dateString = new Date(timestamp).toDateString();
      this.options.subject = 'Elevated Living - Billing Alert';
      this.options.text = `Following clients are running low on ${productName}. As of ${dateString} they have 4 ${productName} sessions left.\n${clientNames}`;
      this.options.html = `Following clients are running low on ${productName}. As of ${dateString} they have 4 ${productName} sessions left.<br />${clientNames.split('\n').join('<br/>')}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  oneLeftAdmin (clientNames, productName, timestamp) {
    return new Promise((resolve, reject) => {
      const dateString = new Date(timestamp).toDateString();
      this.options.subject = 'Elevated Living - Billing Alert';
      this.options.text = `Following clients are running low on ${productName}. As of ${dateString} they have 1 ${productName} left.\n${clientNames}`;
      this.options.html = `Following clients are running low on ${productName}. As of ${dateString} they have 1 ${productName} left.<br />${clientNames.split('\n').join('<br/>')}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  zeroLeftAdmin (client, trainer, productName, timestamp) {
    return new Promise((resolve, reject) => {
      const dateString = new Date(timestamp).toDateString();
      this.options.subject = 'Elevated Living - Billing Alert';
      this.options.text = `${client.user.firstName} ${client.user.lastName} has a ${productName} scheduled with ${trainer.user.firstName} ${trainer.user.lastName} on ${dateString} but don't have any available sessions left to use.`;
      this.options.html = `${client.user.firstName} ${client.user.lastName} has a ${productName} scheduled with ${trainer.user.firstName} ${trainer.user.lastName} on ${dateString} but don't have any available sessions left to use.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  sendReceiptAdmin (client, productName) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Purchase receipt';
      this.options.text = `${client.user.firstName} ${client.user.lastName} (${client.street} ${client.apartment} / ${client.user.email} / ${client.phone}) purchased ${productName}.`;
      this.options.html = `${client.user.firstName} ${client.user.lastName} (${client.street} ${client.apartment} / ${client.user.email} / ${client.phone}) purchased ${productName}.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  sendReceipt (client, productName) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Purchase Receipt';
      this.options.text = `Dear ${client.user.firstName} ${client.user.lastName}, thank you for purchasing ${productName}. You can find your receipt in the dashboard. If you have any questions please email hello@elevatedliving.com. Thanks and have a great day!`;
      this.options.html = `Dear ${client.user.firstName} ${client.user.lastName},<br><br>thank you for purchasing ${productName}. You can find your receipt <a href="https://app.elevatedliving.com/#/dashboard/user-panel/invoices">here</a>. If you have any questions please email <a href="mailto:hello@elevatedliving.com?Subject=Purchase%20question" target="_top">hello@elevatedliving.com</a>.<br><br>Thanks and have a great day!`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  checkedInTrainingAdmin (client, trainingName, buildingName) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - New client signed up for an event';
      this.options.text = `${client.user.firstName} ${client.user.lastName} (${client.street} ${client.apartment} / ${client.user.email} / ${client.phone}) signed up for ${trainingName} at ${buildingName}.`;
      this.options.html = `${client.user.firstName} ${client.user.lastName} (${client.street} ${client.apartment} / ${client.user.email} / ${client.phone}) signed up for ${trainingName} at ${buildingName}.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  checkedInTrainingUser (client, trainingName, buildingName, contactEmail) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Confirmation Of Attendance';
      this.options.text = `Dear ${client.user.firstName} ${client.user.lastName}, thank you for signing up for ${trainingName} at ${buildingName}. If you have any questions please email ${contactEmail}. Thanks and have a great day!`;
      this.options.html = `Dear ${client.user.firstName} ${client.user.lastName},<br><br>thank you for signing up for ${trainingName} at ${buildingName}. If you have any questions please email <a href="mailto:${contactEmail}?Subject=Confirmation%20of%20attendance" target="_top">${contactEmail}</a>.<br><br>Thanks and have a great day!`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  newClient (client) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - New client registration';
      this.options.text = `${client.user.firstName} ${client.user.lastName}(${client.user.email}) living at ${client.apartment} ${client.street}, ${client.zipCode} just registered through our app.`;
      this.options.html = `${client.user.firstName} ${client.user.lastName}(${client.user.email}) living at ${client.apartment} ${client.street}, ${client.zipCode} just registered through our app.`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  dietBought (client, diet) {
    return new Promise((resolve, reject) => {
      this.options.subject = 'Elevated Living - Client bought diet';
      this.options.text = `${client.user.firstName} ${client.user.lastName}(${client.user.email}) just bought ${diet.name} diet`;
      this.options.html = `<b>${client.user.firstName} ${client.user.lastName}</b>(${client.user.email}) just bought <b>${diet.name}</b> diet`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  toolConfirm (client, sku) {
    return new Promise((resolve, reject) => {
      this.options.subject = `Elevated Living - You bought ${sku.name}`;
      this.options.text = `Hi ${client.user.firstName} ${client.user.lastName}. You bought ${sku.name}`;
      this.options.html = `Hi ${client.user.firstName} ${client.user.lastName}<br />You bought ${sku.name}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  toolBought (client, sku) {
    return new Promise((resolve, reject) => {
      this.options.subject = `Elevated Living - Client bought ${sku.name}`;
      this.options.text = `${client.user.firstName} ${client.user.lastName}(${client.user.email}) just bought ${sku.name}`;
      this.options.html = `<b>${client.user.firstName} ${client.user.lastName}</b>(${client.user.email}) just bought <b>${sku.name}</b>`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  announcement (message, title, file) {
    return new Promise((resolve, reject) => {
      this.options.subject = `${title}`;
      this.options.text = `${message}`;
      this.options.html = `${message}`;
      if(file)
        this.options.attachments = {
          filename : `${title}.pdf`,
          content : file,
        };

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  personalNotification (message, title, firstName) {
    return new Promise((resolve, reject) => {

      this.options.subject = `${title}`;
      this.options.text = `Hi ${firstName}. ${message}`;
      this.options.html = `Hi ${firstName}.<br />${message}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  notifyParticipants (senderName, title, message) {
    return new Promise((resolve, reject) => {

      this.options.subject = `${title}`;
      this.options.text = `${message} ${senderName}`;
      this.options.html = `${message}<br /><br />${senderName}`;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  bookService (data) {
    return new Promise((resolve, reject) => {

      this.options.subject = 'Service request';
      this.options.text = `Name: ${data.name}. Email: ${data.email}. Phone: ${data.phone}. Address: ${data.address}. Building: ${data.buildingName}. Service type: ${data.serviceName}. Date: ${data.date}. Message: ${data.message}.`;
      if (data.questions) {
        const questions = JSON.parse(data.questions);
        var inner_html = '';
        questions.map((item) => {
          if (item.answers.length > 0) {
            item.answers.map(_answer => {
              inner_html += "Question: " + item.question + "<br />" + "Answer: " + _answer + "<br /><br />";
            })
          } else {
            inner_html += "Question: " + item.question + "<br />" + "Answer: <br /><br/>";
          }
        });
      }

      this.options.html = `
        Name: ${data.name}<br />
        Email: ${data.email}<br />
        Phone: ${data.phone}<br />
        Address: ${data.address}<br />
        Apartment Number: ${data.apartment_number} <br />
        Building: ${data.buildingName}<br />
        Price: ${data.price}<br />` +
        inner_html +
        `Service type: ${data.serviceName}<br />
        Date: ${data.date}<br />
        Message: ${entities.encode(data.message)}<br />
      `;

      return this.__send()
        .then(resolve)
        .catch(reject);
    });
  }

  _generateUserHash (email, prefix) {
    return new Promise((resolve, reject) => {
      const hash = crypto.randomBytes(30).toString('hex');

      // Delete key if exit
      client.del(prefix + email, err => {
        if (err) {
          sails.log.error(err);
          return reject();
        }
        // Create new one and set expire time on 7 days
        client.set(prefix + email, hash, 'EX', 60 * 60 * 24 * 7, err => {
          if (err) {
            sails.log.error(err);
            return reject();
          }

          return resolve(hash);
        });
      });
    });
  }
}

module.exports = {
  sendReceiptAdmin ({ admin, client, productName }) {
    return new Promise((resolve, reject) => {
      new Email(admin.user)
        .sendReceiptAdmin(client, productName)
        .then(resolve)
        .catch(reject);
    });
  },

  checkedInTrainingAdmin (admin, client, trainingName, buildingName) {
    return new Promise((resolve, reject) => {
      new Email(admin.user)
        .checkedInTrainingAdmin(client, trainingName, buildingName)
        .then(resolve)
        .catch(reject);
    });
  },

  checkedInTrainingUser (client, trainingName, buildingName, contactEmail) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email)
        .checkedInTrainingUser(client, trainingName, buildingName, contactEmail)
        .then(resolve)
        .catch(reject);
    });
  },

  newClient ({ admin, client }) {
    return new Promise((resolve, reject) => {
      new Email(admin.user)
        .newClient(client)
        .then(resolve)
        .catch(reject);
    });
  },

  sendActivation (userEmail) {
    return new Promise((resolve, reject) => {
      new Email(userEmail)
        .activateAccount()
        .then(resolve)
        .catch(reject);
    });
  },

  sendActivationStaff (email) {
    return new Promise((resolve, reject) => {
      new Email(email)
        .activateStaff()
        .then(resolve)
        .catch(reject);
    });
  },

  sendResetPassword (email) {
    return new Promise((resolve, reject) => {
      new Email(email)
        .resetPassword()
        .then(resolve)
        .catch(reject);
    });
  },

  notifiCanceledTraining (training, emails, doer) {
    return new Promise((resolve, reject) => {
      new Email(emails)
        .canceledTraining(training, doer)
        .then(resolve)
        .catch(reject);
    });
  },

  fourLeft (client, productName) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email) // user email
        .fourLeft(client, productName)
        .then(resolve)
        .catch(reject);
    });
  },

  oneLeft (client, productName) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email) // user email
        .oneLeft(client, productName)
        .then(resolve)
        .catch(reject);
    });
  },

  zeroLeft (client, productName) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email) // user email
        .zeroLeft(client, productName)
        .then(resolve)
        .catch(reject);
    });
  },

  minusOneLeft (client, productName, trainer, date) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email) // user email
        .minusOneLeft(client, productName, trainer, date)
        .then(resolve)
        .catch(reject);
    });
  },

  sendGift (_gift, client, recipient, message) {
    return new Promise((resolve, reject) => {
      new Email(recipient) // user email
        .sendGift({ gift: _gift, client: client, recipient: recipient, message: message })
        .then(resolve)
        .catch(reject);
    });
  },

  confirmAssessment (client) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email) // user email
        .confirmAssessment()
        .then(resolve)
        .catch(reject);
    });
  },

  notifyAssessment (managersEmails, client) {
    return new Promise((resolve, reject) => {
      new Email(managersEmails) // user email
        .notifyAssessment({ clientName: `${client.user.firstName} ${client.user.lastName}`, clientEmail: client.user.email, clientPhone: client.phone, clientAddress: `${client.street} ${client.apartment}` })
        .then(resolve)
        .catch(reject);
    });
  },

  confirmGift (_gift, client, recipient, message) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email) // user email
        .confirmGift({ gift: _gift, client: client, message: message })
        .then(resolve)
        .catch(reject);
    });
  },

  notyfiGiftManager (_gift, client, recipient, message, managersEmail) {
    return new Promise((resolve, reject) => {
      new Email(managersEmail)
        .notifyGiftManager({ gift: _gift, clientName: `${client.user.firstName} ${client.user.lastName}`, clientAddress: `${client.street} ${client.apartment}`, recipient: recipient, message: message })
        .then(resolve)
        .catch(reject);
    });
  },

  oneWeekManager (data) {
    return new Promise((resolve, reject) => {
      new Email(data.emails) // user email
        .oneWeekManager(data.clientNames)
        .then(resolve)
        .catch(reject);
    });
  },

  oneMonthManager (data) {
    return new Promise((resolve, reject) => {
      new Email(data.emails) // user email
        .oneMonthManager(data.clientNames)
        .then(resolve)
        .catch(reject);
    });
  },

  withoutMeasurements (data) {
    return new Promise((resolve, reject) => {
      new Email(data.emails) // user email
        .withoutMeasurements(data.clientNames)
        .then(resolve)
        .catch(reject);
    });
  },

  sendReceipt (data) {
    return new Promise((resolve, reject) => {
      new Email(data.email) // user email
        .sendReceipt(data.client, data.productName)
        .then(resolve)
        .catch(reject);
    });
  },

  remindAppointment (client, productName) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email)
        .remindAppointment(client, productName)
        .then(resolve)
        .catch(reject);
    });
  },

  remindAppointmentTrainer (trainer, productName, timestamp) {
    return new Promise((resolve, reject) => {
      new Email(trainer.user.email)
        .remindAppointmentTrainer(trainer, productName, timestamp)
        .then(resolve)
        .catch(reject);
    });
  },

  oneLeftManager (data) {
    return new Promise((resolve, reject) => {
      new Email(data.emails)
        .oneLeftManager(data.clientNames)
        .then(resolve)
        .catch(reject);
    });
  },

  firstVisit (data) {
    return new Promise((resolve, reject) => {
      new Email(data.emails)
        .firstVisit(data.trainer, data.clientNames)
        .then(resolve)
        .catch(reject);
    });
  },

  dietBought (manager, client, diet) {
    return new Promise((resolve, reject) => {
      new Email(manager.user)
        .dietBought(client, diet)
        .then(resolve)
        .catch(reject);
    });
  },

  toolConfirm (client, sku) {
    return new Promise((resolve, reject) => {
      new Email(client.user.email)
        .toolConfirm(client, sku)
        .then(resolve)
        .catch(reject);
    });
  },

  toolBought (managerEmails, client, sku) {
    return new Promise((resolve, reject) => {
      new Email(managerEmails)
        .toolBought(client, sku)
        .then(resolve)
        .catch(reject);
    });
  },

  sendAnnouncement (clients, message, title, file) {
    return new Promise((resolve, reject) => {
      new Email(clients)
        .announcement(message, title, file)
        .then(resolve)
        .catch(reject);
    });
  },

  personalNotification (issuedTo, message, title, firstName) {
    return new Promise((resolve, reject) => {
      new Email(issuedTo)
        .personalNotification(message, title, firstName)
        .then(resolve)
        .catch(reject);
    });
  },

  notifyParticipants (emails, senderName, data) {
    return new Promise((resolve, reject) => {
      new Email(emails)
        .notifyParticipants(senderName, data.title, data.message)
        .then(resolve)
        .catch(reject);
    });
  },

  bookService (emails, data) {
    return new Promise((resolve, reject) => {
      new Email(emails)
        .bookService(data)
        .then(resolve)
        .catch(reject);
    });
  },
};
