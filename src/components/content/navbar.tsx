import { Card } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const navItems = [
  {
    title: "Chat",
    href: "/",
    isExternal: false,
  },
  {
    title: "Contribution Guide",
    href: "/contributing",
    isExternal: false,
  },
];

export const ContentNavbar = () => {
  return (
    <div className="w-full flex justify-center font-normal" data-test="header">
      <Card
        className="bg-transparent py-2 px-4 flex justify-between gap-6 w-full lg:w-2/3 border-[0.25px] border-muted-foreground rounded-full"
        style={{ backdropFilter: "blur(20px)" }}
        data-test="header-card"
      >
        <div>
          <Link
            prefetch={true}
            href="/about"
            className="flex items-center"
            data-test="brand-logo"
          >
            <Image height={40} width={40} src="/logo.svg" alt="logo" />
            <span className="text-base font-bold text-primary">RAG Demo</span>
          </Link>
        </div>

        <NavigationMenu>
          <NavigationMenuList className="flex items-start gap-10 text-muted-foreground">
            {navItems.map((item, i) => (
              <NavigationMenuItem asChild key={i}>
                <Link
                  prefetch={true}
                  href={item.href}
                  target={item.isExternal ? "_blank" : ""}
                  data-test={`nav-link-${item.title
                    .toLowerCase()
                    .replace(" ", "-")}`}
                >
                  {item.title}
                  {item.isExternal && <sup className="ml-1">↗</sup>}
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden lg:flex items-center">
          <div>
            <Link
              prefetch={true}
              passHref
              href="/app/login"
              data-test="get-started-mobile"
            >
              <Button className="w-full rounded-full" variant="outline">
                <GitHubLogoIcon className="w-6 h-6 mr-2" />
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
};
