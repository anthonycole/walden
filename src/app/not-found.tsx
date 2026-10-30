import { Box, Heading, Text } from '@chakra-ui/react';

export default function NotFound() {
	return (
		<Box
			display="flex"
			flexDirection="column"
			alignItems="center"
			justifyContent="center"
			minH="100vh"
			bg="gray.50"
		>
			<Heading size="2xl" mb={4}>
				404
			</Heading>
			<Text fontSize="lg" color="gray.600">
				Page not found
			</Text>
		</Box>
	);
}
