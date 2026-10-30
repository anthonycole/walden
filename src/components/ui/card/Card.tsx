import { Card as ChakraCard } from '@chakra-ui/react';
import type { ComponentProps, ReactNode } from 'react';
import { Children, cloneElement, forwardRef, isValidElement } from 'react';

type ChakraCardRootProps = ComponentProps<typeof ChakraCard.Root>;
type ChakraCardBodyProps = ComponentProps<typeof ChakraCard.Body>;
type ChakraCardHeaderProps = ComponentProps<typeof ChakraCard.Header>;
type ChakraCardFooterProps = ComponentProps<typeof ChakraCard.Footer>;

export interface CardProps extends Omit<ChakraCardRootProps, 'children' | 'variant'> {
	children: ReactNode;
	/** Hover effect for interactive cards */
	interactive?: boolean;
	/** Variant style */
	variant?: 'default' | 'error' | 'info';
	/** Optional props applied to an auto-rendered Card.Body */ bodyProps?: ChakraCardBodyProps;
	/** When true, wrap children in Card.Body if one is not already provided */
	withBody?: boolean;
}

/**
 * Consolidated Card component that wraps Chakra UI Card
 * Use this for all card-like UI elements throughout the application
 */
const Card = forwardRef<HTMLDivElement, CardProps>(
	(
		{
			children,
			className,
			interactive = false,
			variant = 'default',
			bodyProps,
			withBody = false,
			...props
		},
		ref
	) => {
		const variantStyles = {
			default: {},
			error: {
				bg: 'red.50',
				borderColor: 'red.200',
				borderWidth: '1px',
			},
			info: {
				bg: 'sage.50',
			},
		};

		const childrenArray = Children.toArray(children);
		const hasExplicitBody = childrenArray.some((child) => {
			if (!isValidElement(child)) return false;
			const childType = child.type as { displayName?: string };
			return child.type === ChakraCard.Body || childType?.displayName === 'CardBody';
		});

		let content: ReactNode = children;

		if (bodyProps) {
			if (hasExplicitBody) {
				content = Children.map(children, (child) => {
					if (!isValidElement(child)) return child;
					const childType = child.type as { displayName?: string };
					if (child.type === ChakraCard.Body || childType?.displayName === 'CardBody') {
						const mergedProps = Object.assign(
							{},
							bodyProps,
							child.props
						) as ChakraCardBodyProps;
						return cloneElement(child, mergedProps);
					}
					return child;
				});
			} else {
				content = <ChakraCard.Body {...bodyProps}>{children}</ChakraCard.Body>;
			}
		} else if (withBody && !hasExplicitBody) {
			content = <ChakraCard.Body>{children}</ChakraCard.Body>;
		}

		return (
			<ChakraCard.Root
				ref={ref}
				className={className}
				borderRadius="none"
				{...variantStyles[variant]}
				_hover={
					interactive
						? {
								borderColor: 'brand.400',
								boxShadow: 'md',
								cursor: 'pointer',
							}
						: undefined
				}
				{...props}
			>
				{content}
			</ChakraCard.Root>
		);
	}
);

Card.displayName = 'Card';

/**
 * Card.Body component for card content
 */
const CardBody = forwardRef<HTMLDivElement, ChakraCardBodyProps>(
	({ children, className, ...props }, ref) => {
		return (
			<ChakraCard.Body ref={ref} className={className} {...props}>
				{children}
			</ChakraCard.Body>
		);
	}
);

CardBody.displayName = 'CardBody';

/**
 * Card.Header component for card headers
 */
const CardHeader = forwardRef<HTMLDivElement, ChakraCardHeaderProps>(
	({ children, className, ...props }, ref) => {
		return (
			<ChakraCard.Header ref={ref} className={className} {...props}>
				{children}
			</ChakraCard.Header>
		);
	}
);

CardHeader.displayName = 'CardHeader';

/**
 * Card.Footer component for card footers
 */
const CardFooter = forwardRef<HTMLDivElement, ChakraCardFooterProps>(
	({ children, className, ...props }, ref) => {
		return (
			<ChakraCard.Footer ref={ref} className={className} {...props}>
				{children}
			</ChakraCard.Footer>
		);
	}
);

CardFooter.displayName = 'CardFooter';

// Export as compound component
export default Object.assign(Card, {
	Body: CardBody,
	Header: CardHeader,
	Footer: CardFooter,
});
