import { GithubIcon, LinkedinIcon, MailIcon, InstagramIcon, MessageCircle } from "@/components/ui/icons";
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
    id: 4,
    label: "WhatsApp",
    href: "https://wa.me/212703242650",
    icon: MessageCircle,
    hoverColor: "hover:text-[#25D366] hover:border-[#25D366]/50 hover:bg-[#25D366]/10",
  },
  {
    id: 5,
    label: "Instagram",
    href: "https://instagram.com/radi_code1",
    icon: InstagramIcon,
    hoverColor: "hover:text-pink-400 hover:border-pink-500/50 hover:bg-pink-500/10",
  },
  {
    id: 3,
    label: "Email",
    href: "https://mail.google.com/mail/?view=cm&fs=1&to=radi.adam.2006@gmail.com",
    icon: MailIcon,
    hoverColor: "hover:text-indigo-400 hover:border-indigo-500/50 hover:bg-indigo-500/10",
  },
];