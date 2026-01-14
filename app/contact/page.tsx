import React from 'react';
import { ContactClient } from './components/ContactClient';

export const metadata = {
    title: 'Contacto | MiagoBarber Studio',
    description: 'Ponte en contacto con nosotros para citas especiales o consultas.',
};

export default function ContactPage() {
    return <ContactClient />;
}
