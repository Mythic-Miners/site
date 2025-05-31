import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function SocialProofSection() {
  const { t } = useTranslation();

  const partners = [
    { logo: '/assets/images/polygon.webp', width: 200, height: 50 },
    { logo: '/assets/images/thirdweb.png', width: 200, height: 50 },
    { logo: '/assets/images/unity.png', width: 160, height: 50 },
  ];

  const socialLinks = [
    {
      name: 'twitter',
      icon: 'M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z',
      url: 'https://x.com/mythicminers',
      viewBox: '0 0 24 24',
    },
    {
      name: 'discord',
      icon: 'M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z',
      url: 'https://discord.gg/eRkSdbRCtn',
      viewBox: '0 0 24 24',
    },
    {
      name: 'game',
      icon: 'M12 2 L14 4 L10 8 L14 12 L12 14 L8 10 L4 14 L2 12 L6 8 L2 4 L4 2 L8 6 L12 2 Z M9 7 L11 9 M7 11 L9 13M154.5 95.4335L0 250.933C0 250.933 4.92318 261.149 10 265.933C15.0768 270.717 26 275.433 26 275.433L179.5 119.433L189 128.5L213.931 104.5C213.931 104.5 236.944 125.568 251.498 150.933C266.052 176.298 270.498 239.968 272.998 239.433C275.498 238.897 284.998 208.432 284.998 177.433C284.998 146.433 268.498 106.933 268.498 106.933L237.498 77.5306L248.998 65.5306C251.998 61.0301 248.998 57.0306 248.998 57.0306L213.998 24.0306C213.998 24.0306 209.998 19.303 205.998 24.0306L194.998 37.0306L171.498 14.9329C171.498 14.9329 123.998 -2.96883 83.9978 0.429006C43.9978 3.82684 22.9978 25.9332 24.4978 27.4329C25.9978 28.9326 87.9405 21.9642 115.998 31.4329C144.055 40.9016 168.931 60.5 168.931 60.5L145.431 86L154.5 95.4335Z',
      url: 'https://www.mythicminers.com/',
      viewBox: '0 0 285 276',
    },
    {
      name: 'instagram',
      icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
      url: 'https://www.instagram.com/mythicminers/',
      viewBox: '0 0 24 24',
    },
    {
      name: 'email',
      icon: 'M12 12.713l-11.985-9.713h23.97l-11.985 9.713zm0 2.574l-12-9.725v15.438h24v-15.438l-12 9.725z',
      url: 'mailto:contact@mythicminers.com',
      viewBox: '0 0 24 24',
    },
  ];

  return (
    <section className="bg-gray-800/50 pt-10 pb-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 opacity-0 translate-y-[20px] animate-[fadeIn_0.6s_ease-out_forwards]">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-stone-100 mythic-text-shadow">
            {t('socialProof.technologies.title')}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-4 md:gap-8 mb-16">
          {partners.map((partner, index) => (
            <div
              key={partner.logo}
              className=" bg-gray-900/20 p-6 rounded-lg flex items-center justify-center h-28 opacity-0 translate-y-[20px] animate-[fadeIn_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${300 + index * 100}ms` }}
            >
              <Image
                src={partner.logo}
                alt="Partner Logo"
                width={partner.width}
                height={partner.height}
              />
            </div>
          ))}
        </div>

        <div
          className="mt-30 text-center mb-10 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]"
          style={{ animationDelay: '300ms' }}
        >
          <h3 className="text-3xl font-bold mb-4 text-stone-100 mythic-text-shadow">
            {t('socialProof.community.title')}
          </h3>
          <p className="text-stone-300 max-w-2xl mx-auto mb-8">
            {t('socialProof.community.description')}
          </p>
        </div>

        <div className="flex md:flex-row flex-col flex-wrap justify-center gap-2 md:gap-8 ">
          {socialLinks.map((link, index) => (
            <a
              key={link.name}
              href={link.url}
              className="text-lg md:text-base justify-center border border-neutral-950 flex items-center gap-3 md:gap-2 text-stone-300 hover:text-stone-100 transition-colors bg-gray-900/50 hover:bg-gray-900/40 p-3 rounded-lg opacity-0 scale-[0.8] animate-[fadeScale_0.4s_ease-out_forwards] hover:scale-[0.9] active:scale-[0.85]"
              style={{ animationDelay: `${500 + index * 100}ms` }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="currentColor"
                viewBox={link.viewBox}
              >
                <path d={link.icon} />
              </svg>
              {t(`socialProof.socialLinks.${link.name}`)}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
