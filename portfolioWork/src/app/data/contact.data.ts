import { IconName } from 'src/app/shared/models/icon.model';

export interface ContactSection {
  id: string;
  title: string;
  description: string;
  icon: IconName;
}

export interface ContactButton {
  label: string;
  url: string;
  icon: IconName;
  external?: boolean;
}

export interface ContactPageData {
  headline: string;
  introduction: string;
  sections: ContactSection[];
  buttons: ContactButton[];
}

export const CONTACT_DATA: ContactPageData = {
  headline: 'Get in Touch',
  introduction:
    "I'd love to connect, learn, and collaborate. If you have feedback, ideas, opportunities, or just want to say hello, feel free to reach out.",
  sections: [
    {
      id: 'contact-form',
      title: 'Contact Me',
      description:
        'Use the form to share your thoughts, questions, or suggestions - it helps me learn and grow through meaningful conversations.',
      icon: 'email',
    },
    {
      id: 'job-referral',
      title: 'Refer Me for an Opportunity',
      description:
        'Know a role that might be a good fit for me? You can quickly refer me by sharing a job link or relevant details.',
      icon: 'briefcase',
    },
  ],
  buttons: [
    {
      label: 'Contact Me',
      url: 'https://docs.google.com/forms/d/e/1FAIpQLScc14Pvzprt7ox5IWsXkTYCkjfdC9BZOstd052-evFSaaCR_Q/viewform?usp=header',
      icon: 'send',
      external: true,
    },
  ],
};
