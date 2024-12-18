import { transporter } from '../../config/EmailConfig'
import { VERIFICATION_EMAIL_TEMPLATE } from '../../constant/EmailTemplate'
import logger from '../../util/logger'
import config from '../../config/config'

interface EmailResponse {
    success: boolean
    message: string
}

export const SendVerificationEmail = async (name: string, email: string, verificationToken: string): Promise<EmailResponse> => {
    const htmlContent = VERIFICATION_EMAIL_TEMPLATE.replace('{name}', name).replace('{verificationCode}', verificationToken)

    const mailOptions = {
        from: config.EMAIL,
        to: email,
        subject: 'Verify Your Email',
        html: htmlContent
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const info = await transporter.sendMail(mailOptions)
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        logger.info(`Email sent: ${info.response}`)
        return { success: true, message: 'Email sent successfully' }
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to send email'
        logger.error(`Error in sending email: ${message}`)
        return { success: false, message }
    }
}
