declare module "@emailjs/nodejs" {
    interface EmailJSOptions {
        publicKey: string;
        privateKey?: string;
    }

    function send(
        serviceId: string,
        templateId: string,
        templateParams: Record<string, string>,
        options: EmailJSOptions,
    ): Promise<unknown>;

    const emailjs: {
        send: typeof send;
    };

    export default emailjs;
}
