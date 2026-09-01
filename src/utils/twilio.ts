import twilio from 'twilio';

class MessagingClient {
  #client;
  readonly #twilioNumber: string = import.meta.env.VITE_WHATSAPP_NUMBER;
  #toNumber: string;

  constructor(cellphone: string) {
    try {
      this.#client = new twilio.Twilio(
        import.meta.env.VITE_TWILIO_API_KEY,
        import.meta.env.VITE_TWILIO_SECRET,
        {
          accountSid: import.meta.env.VITE_TWILIO_ACCOUNT_SID,
        },
      );
    } catch (error: unknown) {
      console.error('ERROR', error);
    }
    this.#toNumber = `whatsapp:+${cellphone}`;
  }

  async sendSignUp(name: string) {
    let message =
      '👋 Te damos la bienvenida a *Pluvia*💧\nActualmente no estás registrado en nuestro sistema.\n';

    if (name === '') {
      message += 'Para continuar, por favor indícanos tu nombre completo:';
    } else {
      message += `Detectamos que tu nombre es ${name}. ¿Deseas cambiarlo?`;
    }

    console.log(message);
    if (this.#client)
      this.#client.messages
        .create({
          body: message,
          to: this.#toNumber,
          from: this.#twilioNumber,
        })
        .then((twilioMessage) => console.log('>>> twilioMessage', twilioMessage));
  }
}

export { MessagingClient };
