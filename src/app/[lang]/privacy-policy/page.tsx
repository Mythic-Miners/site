import React from 'react';

import { getTranslation } from '@/lib/i18n-server';

interface PrivacyPolicyProps {
  params: Promise<{
    lang: string;
  }>;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = async ({ params }) => {
  const { lang } = await params;

  return (
    <div
      className="text-yellow-50"
      style={{
        textAlign: 'justify',
        margin: '40px auto',
        minWidth: '350px',
        width: '80%',
        padding: '0 0 40px',
      }}
      dangerouslySetInnerHTML={{
        __html: getTranslation(lang, 'privacyPolicy.content'),
      }}
    />
  );
};

export default PrivacyPolicy;
