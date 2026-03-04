import * as React from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card" 

interface CustomCardProps {
 
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  selected?: boolean
}

export function CustomCard({
  title,
  description,
  children,
  footer,
  className,
  selected = false,
}: CustomCardProps) {
  return (
    <Card className={className}  style={{
        background: selected
          ? "linear-gradient(to right top, #2563EB 0%, transparent 100%)"
          : "transparent", // ou outra cor padrão
      }}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {children && <CardContent>{children}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  )
}