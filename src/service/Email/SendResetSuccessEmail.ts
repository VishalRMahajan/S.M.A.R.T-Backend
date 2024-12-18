import { transporter } from '../../config/EmailConfig'
import { PASSWORD_RESET_SUCCESS_TEMPLATE } from '../../constant/EmailTemplate'
import logger from '../../util/logger'
import config from '../../config/config'

interface EmailResponse {
    success: boolean
    message: string
}

export const SendResetSuccessEmail = async (name: string, email: string): Promise<EmailResponse> => {
    const htmlContent = PASSWORD_RESET_SUCCESS_TEMPLATE.replace('{name}', name)

    const mailOptions = {
        from: config.EMAIL,
        to: email,
        subject: 'Password Reset Successfully of S.M.A.R.T(Student Marking and Assessment Record Tool)',
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
