import { GithubIcon, LinkedinIcon, MailIcon } from "@/components/ui/icons";
import { SocialLink } from "@/types/social";

export const socials: SocialLink[] = [
  {
    id: 1,
    label: "GitHub",
    href: "https://github.com/adam-radi",
    icon: GithubIcon,
    hoverColor: "hover:text-cyan-400 hover:border-cyan-500/50 hover:bg-cyan-500/10",
  },
  {
    id: 2,
    label: "LinkedIn",
    href: "https://linkedin.com/in/adamradi-",
    icon: LinkedinIcon,
    hoverColor: "hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10",
  },
  {
    id: 3,
    label: "Email",
    href: "mailto:adam.radi.2006@gmail.com",
    icon: MailIcon,
    hoverColor: "hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10",
  },
];