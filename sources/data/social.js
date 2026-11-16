/**
 * Contact links placed around the statue in the social area.
 *
 * `name`  - the label shown on the 3D marker
 * `url`   - opened in a new tab
 * `modal` - name of a modal to open instead (used for the contact card)
 * `align` - 'left' or 'right', decides which side the marker text sits on
 */

export default [
    { name: 'Email', url: 'mailto:samsspy01@gmail.com', align: 'right' },
    { name: 'Phone', url: 'tel:+8801617541939', align: 'right' },
    { name: 'WhatsApp', url: 'https://wa.me/8801853397899', align: 'right' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/sams-shahriar', align: 'right' },
    { name: 'GitHub', url: 'https://github.com/borohuz1', align: 'left' },
    { name: 'EsolverBD', url: 'https://esolver.site', align: 'left' },
    { name: 'Dhaka', url: 'https://www.google.com/maps/search/?api=1&query=Khilgaon%2C+Dhaka+1219%2C+Bangladesh', align: 'left' },
    { name: 'Contact card', modal: 'contact', align: 'right' }
]

