exports.getPrivacyPolicy = (req, res, next) => {
    res.render('legal/privacy-policy', {
        pageTitle: 'Privacy Policy',
    })
}

exports.getCredits = (req, res, next) => {
    const credits = [
        {
            imagePath: '/images/site-images/card-images/javascript.png',
            source: {
                name: 'Flaticon',
                link: 'https://www.flaticon.com/'
            },
            author: {
                name: 'Freepik',
                link: 'https://www.flaticon.com/authors/freepik'
            }
        }
    ]

    res.render('legal/credits', {
        pageTitle: 'Image Credits',
        credits: credits
    })
}