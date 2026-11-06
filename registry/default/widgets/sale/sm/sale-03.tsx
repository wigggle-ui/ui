"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Widget, WidgetContent } from "@/registry/default/ui/widget";

const WidgetDemo = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributeFilter: ["class"],
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  return (
    <Widget design="new-york" className="border-productive">
      <WidgetContent className="bg-productive/80 dark:bg-productive/50 mx-auto w-full flex-col items-center justify-center gap-1.5 rounded-2xl px-3">
        <Label
          variant={isDark ? "foreground" : "background"}
          className="text-center"
          size="xl"
          weight="semibold"
        >
          Get 20% Off
        </Label>
        <form
          className="[&_[data-slot=input]::placeholder]:text-background/75 **:data-[slot=input]:text-background dark:**:data-[slot=input]:text-foreground dark:[&_[data-slot=input]::placeholder]:text-muted-foreground flex w-full flex-col gap-2"
          onSubmit={(event) => {
            event.preventDefault();

            const formData = new FormData(event.currentTarget);
            const name = formData.get("name");
            const email = formData.get("email");

            if (
              typeof name !== "string" ||
              !name.trim() ||
              typeof email !== "string" ||
              !email.trim()
            ) {
              return;
            }

            toast.success(`Coupon code sent to ${email}`);
          }}
        >
          <Field>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              required
            />
          </Field>
          <Field>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your Email"
              required
            />
          </Field>
          <Field>
            <Button
              type="submit"
              variant="productive"
              className="w-full"
              size="sm"
            >
              Claim Discount
            </Button>
          </Field>
        </form>
      </WidgetContent>
    </Widget>
  );
};

export default WidgetDemo;
