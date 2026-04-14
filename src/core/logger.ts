import chalk from 'chalk';

export class Logger {
    private static formatData(data?: any) {
        if (data === undefined || data === null) {
            return '';
        }

        if (typeof data === 'string') {
            return data;
        }

        try {
            return JSON.stringify(data, null, 2);
        } catch {
            return String(data);
        }
    }

    static info(message: string, data?: any) {
        console.log(chalk.green(`[INFO] ${new Date().toISOString()} - ${message}`)
        );

        if (data !== undefined) {
            console.log(this.formatData(data)); // ⬅️ no color
        }
    }

    static error(message: string, data?: any) {
        console.error(
            chalk.red(`[ERROR] ${new Date().toISOString()} - ${message}`)
        );

        if (data !== undefined) {
            console.error(this.formatData(data)); // ⬅️ no color
        }
    }

    static debug(message: string, data?: any) {
        console.log(
            chalk.blue(`[DEBUG] ${new Date().toISOString()} - ${message}`)
        );

        if (data !== undefined) {
            console.log(this.formatData(data)); // ⬅️ no color
        }
    }
}