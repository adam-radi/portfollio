import Link from "next/link";
import { socials } from "@/data/socials";

export default function SocialLinks() {
  return (
    <div>
      {socials.map((social) => {
        const Icon = social.icon;

        return (
          <Link
            key={social.id}
            href={social.href}
            target="_blank"
            aria-label={social.label}
          >
            <Icon />
          </Link>
        );
      })}
    </div>
  );
}