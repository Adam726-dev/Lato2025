import React from 'react';
import { Button as ShadcnButton } from '@/components/ui/button';
import { Input as ShadcnInput } from '@/components/ui/input';
import { Label as ShadcnLabel } from '@/components/ui/label';
import { RadioGroup as ShadcnRadioGroup, RadioGroupItem as ShadcnRadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox as ShadcnCheckbox } from '@/components/ui/checkbox';
import { Textarea as ShadcnTextarea } from '@/components/ui/textarea';
import { Badge as ShadcnBadge } from '@/components/ui/badge';
import { Switch as ShadcnSwitch } from '@/components/ui/switch';
import { Card as ShadcnCard, CardContent as ShadcnCardContent, CardHeader as ShadcnCardHeader, CardTitle as ShadcnCardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export const Button = React.forwardRef<
  React.ElementRef<typeof ShadcnButton>,
  React.ComponentPropsWithoutRef<typeof ShadcnButton>
>((props, ref) => {
  return <ShadcnButton ref={ref} {...props} />;
});
Button.displayName = 'Button';

export const Input = React.forwardRef<
  React.ElementRef<typeof ShadcnInput>,
  React.ComponentPropsWithoutRef<typeof ShadcnInput>
>((props, ref) => {
  return <ShadcnInput ref={ref} {...props} />;
});
Input.displayName = 'Input';

export const Label = React.forwardRef<
  React.ElementRef<typeof ShadcnLabel>,
  React.ComponentPropsWithoutRef<typeof ShadcnLabel>
>((props, ref) => {
  return <ShadcnLabel ref={ref} {...props} />;
});
Label.displayName = 'Label';

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof ShadcnRadioGroup>,
  React.ComponentPropsWithoutRef<typeof ShadcnRadioGroup>
>((props, ref) => {
  return <ShadcnRadioGroup ref={ref} {...props} />;
});
RadioGroup.displayName = 'RadioGroup';

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof ShadcnRadioGroupItem>,
  React.ComponentPropsWithoutRef<typeof ShadcnRadioGroupItem>
>((props, ref) => {
  return <ShadcnRadioGroupItem ref={ref} {...props} />;
});
RadioGroupItem.displayName = 'RadioGroupItem';

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof ShadcnCheckbox>,
  React.ComponentPropsWithoutRef<typeof ShadcnCheckbox>
>((props, ref) => {
  return <ShadcnCheckbox ref={ref} {...props} />;
});
Checkbox.displayName = 'Checkbox';

export const Textarea = React.forwardRef<
  React.ElementRef<typeof ShadcnTextarea>,
  React.ComponentPropsWithoutRef<typeof ShadcnTextarea>
>((props, ref) => {
  return <ShadcnTextarea ref={ref} {...props} />;
});
Textarea.displayName = 'Textarea';

export const Badge: React.FC<React.ComponentProps<typeof ShadcnBadge>> = (props) => {
  return <ShadcnBadge {...props} />;
};
Badge.displayName = 'Badge';

export const Switch = React.forwardRef<
  React.ElementRef<typeof ShadcnSwitch>,
  React.ComponentPropsWithoutRef<typeof ShadcnSwitch>
>((props, ref) => {
  return <ShadcnSwitch ref={ref} {...props} />;
});
Switch.displayName = 'Switch';

export const Card = React.forwardRef<
  React.ElementRef<typeof ShadcnCard>,
  React.ComponentPropsWithoutRef<typeof ShadcnCard>
>((props, ref) => {
  return <ShadcnCard ref={ref} {...props} />;
});
Card.displayName = 'Card';

export const CardContent = React.forwardRef<
  React.ElementRef<typeof ShadcnCardContent>,
  React.ComponentPropsWithoutRef<typeof ShadcnCardContent>
>((props, ref) => {
  return <ShadcnCardContent ref={ref} {...props} />;
});
CardContent.displayName = 'CardContent';

export const CardHeader = React.forwardRef<
  React.ElementRef<typeof ShadcnCardHeader>,
  React.ComponentPropsWithoutRef<typeof ShadcnCardHeader>
>((props, ref) => {
  return <ShadcnCardHeader ref={ref} {...props} />;
});
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  React.ElementRef<typeof ShadcnCardTitle>,
  React.ComponentPropsWithoutRef<typeof ShadcnCardTitle>
>((props, ref) => {
  return <ShadcnCardTitle ref={ref} {...props} />;
});
CardTitle.displayName = 'CardTitle';

export const FormGroup: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("space-y-2", className)}>{children}</div>;
};

export const FormRow: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => {
  return <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-4", className)}>{children}</div>;
};
