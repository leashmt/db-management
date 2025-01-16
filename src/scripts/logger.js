import { createLogger, format, transports } from 'winston';

const customFormat = format.combine(
	format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
	format.printf(({ level, message, timestamp }) => {
		return `${timestamp} [${level.toUpperCase()}]: ${message}`;
	})
);

const logger = createLogger({
	level: 'info',
	format: customFormat,
	transports: [
		new transports.File({ filename: './logs/error.log', level: 'error' }),
		new transports.File({ filename: './logs/connection.log', level: 'info' }),
		new transports.Console(),
	],
});

const errorLogger = createLogger({
	level: 'error',
	format: customFormat,
	transports: [new transports.File({ filename: './logs/error.log' })],
});

const connectionLogger = createLogger({
	level: 'info',
	format: customFormat,
	transports: [new transports.File({ filename: './logs/connection.log' })],
});

export { logger, errorLogger, connectionLogger };
