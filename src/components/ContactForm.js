import React, { useState, useRef } from 'react';

const FORM_ID = 'meeblvvz'; // ваш Formspree ID

function ContactForm() {
    const form = useRef();
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const formData = new FormData(form.current);
        formData.append('_subject', 'Новое сообщение с сайта СпортМаркет');

        try {
            const response = await fetch(`https://formspree.io/f/${FORM_ID}`, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json',
                },
            });
            if (response.ok) {
                setSubmitted(true);
                form.current.reset();
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                throw new Error('Ошибка сервера');
            }
        } catch (err) {
            setError('Не удалось отправить. Попробуйте позже.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="contact">
            <h2 className="contact__title">📩 Напишите нам</h2>
            {submitted && <p className="success-message">Сообщение отправлено!</p>}
            {error && <p className="error-message">{error}</p>}
            <form ref={form} className="contact-form" onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Ваше имя" required />
                <input type="email" name="_replyto" placeholder="Email" required />
                <textarea name="message" placeholder="Сообщение" rows={4} required />
                <input type="text" name="_gotcha" style={{ display: 'none' }} tabIndex="-1" autoComplete="off" />
                <button type="submit" disabled={loading}>
                    {loading ? 'Отправка...' : 'Отправить'}
                </button>
            </form>
        </section>
    );
}

export default ContactForm;