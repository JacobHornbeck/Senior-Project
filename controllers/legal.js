const Credit = require("../models/credit")

exports.getPrivacyPolicy = (req, res, next) => {
    res.render('legal/privacy-policy', {
        pageTitle: 'Privacy Policy',
    })
}

exports.getCredits = (req, res, next) => {
    /* Array of course/tutorial card header images */
    const cardCredits = [
        new Credit(
            'Flaticon',
            'https://www.flaticon.com/',
            '/images/site-images/card-images/javascript.png',
            'https://www.flaticon.com/free-icon/js_5968292',
            'Freepik',
            'https://www.flaticon.com/authors/freepik'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/angular.png',
            'https://www.iconfinder.com/icons/308433/angular_front-end_javascript_long_shadow_technologies_web_web_technology_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/css.png',
            'https://www.iconfinder.com/icons/308436/css_front-end_long_shadow_web_web_technology_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/github.png',
            'https://www.iconfinder.com/icons/308438/github_long_shadow_repository_web_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/html.png',
            'https://www.iconfinder.com/icons/308440/front-end_html_long_shadow_markup_language_technologies_web_web_technology_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/jquery.png',
            'https://www.iconfinder.com/icons/308442/front-end_javascript_jquery_js_library_long_shadow_web_web_technology_blue_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/nodejs.png',
            'https://www.iconfinder.com/icons/308444/javascrpt_js_library_long_shadow_nodejs_web_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/python.png',
            'https://www.iconfinder.com/icons/308445/long_shadow_python_script_language_web_web_technology_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/ruby.png',
            'https://www.iconfinder.com/icons/308447/back-end_long_shadow_programming_language_rails_ruby_web_web_technology_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/sass.png',
            'https://www.iconfinder.com/icons/308448/front-end_long_shadow_preprocesor_sass_web_icon',
            'the more',
            'https://www.iconfinder.com/Jozef89'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/card-images/cpp.png',
            'https://www.iconfinder.com/icons/7564189/c_logo_plus_plus_plus_+_+_+_icon',
            'Iconfinder',
            'https://www.iconfinder.com/iconfinder'
        ),
    ]

    /* Array of profile background images */
    const bgCredits = [
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-01.png',
            'https://pixabay.com/vectors/abstract-background-beams-green-1294643/',
            'OpenClipart-Vectors',
            'https://pixabay.com/users/openclipart-vectors-30363/'
        ), // 01
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-02.png',
            'https://pixabay.com/vectors/abstract-background-colorful-1301930/',
            'GDJ',
            'https://pixabay.com/users/gdj-1086657/'
        ), // 02
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-03.png',
            'https://pixabay.com/vectors/abstract-art-paper-cutting-6994323/',
            'stocksbyrg',
            'https://pixabay.com/users/stocksbyrg-19680236/'
        ), // 03
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-04.png',
            'https://pixabay.com/vectors/abstract-art-colorful-background-6994321/',
            'stocksbyrg',
            'https://pixabay.com/users/stocksbyrg-19680236/'
        ), // 04
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-05.png',
            'https://pixabay.com/vectors/abstract-art-paper-cutting-6994330/',
            'stocksbyrg',
            'https://pixabay.com/users/stocksbyrg-19680236/'
        ), // 05
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-06.png',
            'https://pixabay.com/vectors/americana-abstract-graphic-mosaic-1512910/',
            'Fotocitizen',
            'https://pixabay.com/users/fotocitizen-397314/'
        ), // 06
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-07.png',
            'https://pixabay.com/vectors/art-circle-abstract-background-7088315/',
            'satheeshsankaran',
            'https://pixabay.com/users/satheeshsankaran-11196627/'
        ), // 07
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-08.png',
            'https://pixabay.com/vectors/background-abstract-1503840/',
            'DavidRockDesign',
            'https://pixabay.com/users/davidrockdesign-2595351/'
        ), // 08
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-09.png',
            'https://pixabay.com/vectors/background-lines-shapes-1789175/',
            'DavidRockDesign',
            'https://pixabay.com/users/davidrockdesign-2595351/'
        ), // 09
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-10.png',
            'https://pixabay.com/vectors/triangles-polygon-color-pink-1430105/',
            'DavidRockDesign',
            'https://pixabay.com/users/davidrockdesign-2595351/'
        ), // 10
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-11.png',
            'https://pixabay.com/vectors/background-isometric-pattern-cubes-5126570/',
            'GDJ',
            'https://pixabay.com/users/gdj-1086657/'
        ), // 11
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-12.png',
            'https://pixabay.com/vectors/art-pattern-design-background-6689072/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 12
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-13.png',
            'https://pixabay.com/vectors/abstract-minimalist-wallpaper-6467846/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 13
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-14.png',
            'https://pixabay.com/vectors/background-abstract-geometric-6360867/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 14
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-15.png',
            'https://pixabay.com/vectors/abstract-minimalist-wallpaper-6467846/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 15
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-16.png',
            'https://pixabay.com/vectors/background-pattern-abstract-texture-6840278/',
            'stocksbyrg',
            'https://pixabay.com/users/stocksbyrg-19680236/'
        ), // 16
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-17.png',
            'https://pixabay.com/vectors/background-pattern-abstract-texture-6840279/',
            'stocksbyrg',
            'https://pixabay.com/users/stocksbyrg-19680236/'
        ), // 17
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-18.png',
            'https://pixabay.com/vectors/background-pattern-abstract-texture-6840283/',
            'stocksbyrg',
            'https://pixabay.com/users/stocksbyrg-19680236/'
        ), // 18
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-19.png',
            'https://pixabay.com/vectors/background-pattern-abstract-texture-6840285/',
            'stocksbyrg',
            'https://pixabay.com/users/stocksbyrg-19680236/'
        ), // 19
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-20.png',
            'https://pixabay.com/vectors/background-abstract-graphic-texture-7059487/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 20
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-21.png',
            'https://pixabay.com/vectors/colorful-prismatic-chromatic-2099182/',
            'GDJ',
            'https://pixabay.com/users/gdj-1086657/'
        ), // 21
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-22.png',
            'https://pixabay.com/vectors/hive-rhombuses-yellow-abstract-2002878/',
            'nena9002',
            'https://pixabay.com/users/nena9002-2255518/'
        ), // 22
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-23.png',
            'https://pixabay.com/vectors/modern-concept-template-art-6528732/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 23
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-24.png',
            'https://pixabay.com/vectors/mosaic-vector-tile-background-2821062/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ), // 24
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-25.png',
            'https://pixabay.com/vectors/stripes-modern-concept-template-6528728/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 25
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-26.png',
            'https://pixabay.com/vectors/stripes-modern-concept-template-6528731/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 26
        new Credit(
            'Vecteezy',
            'https://www.vecteezy.com/',
            '/images/profile-backgrounds/bg-27.png',
            'https://www.vecteezy.com/vector-art/2381151-shapes-abstract-colorful-background',
            'frik',
            'https://www.vecteezy.com/members/frik'
        ), // 27
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-28.png',
            'https://pixabay.com/vectors/art-pattern-design-background-6689070/',
            'Azheer',
            'https://pixabay.com/users/azheer-17448000/'
        ), // 28
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-29.png',
            'https://pixabay.com/vectors/background-mesh-triangle-polygon-1430103/',
            'DavidRockDesign',
            'https://pixabay.com/users/davidrockdesign-2595351/'
        ), // 29
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-30.png',
            'https://pixabay.com/vectors/mesh-background-triangles-polygon-1430108/',
            'DavidRockDesign',
            'https://pixabay.com/users/davidrockdesign-2595351/'
        ), // 30
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-31.png',
            'https://pixabay.com/vectors/gradient-banner-circle-technology-7206609/',
            'satheeshsankaran',
            'https://pixabay.com/users/satheeshsankaran-11196627/'
        ), // 31
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-32.png',
            'https://pixabay.com/vectors/artwork-background-yellow-flow-3d-7169186/',
            'satheeshsankaran',
            'https://pixabay.com/users/satheeshsankaran-11196627/'
        ), // 32
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-backgrounds/bg-33.png',
            'https://pixabay.com/illustrations/the-polygon-hexagon-the-angular-1562743/',
            'Artturi_Mantysaari',
            'https://pixabay.com/users/artturi_mantysaari-1625672/'
        ), // 33
    ]

    /* Array of profile image credits */
    const profileCredits = [
        new Credit(
            'Genius Coding',
            `http${req.hostname != 'localhost' ? 's' : ''}://${req.headers.host}`,
            '/images/profile-images/pi-00.png',
            '#',
            'Jacob Hornbeck',
            `http${req.hostname != 'localhost' ? 's' : ''}://${req.headers.host}/user/profile/[userId]`
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-01.png',
            'https://pixabay.com/illustrations/capricorn-alpine-animal-switzerland-3265714/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-02.png',
            'https://pixabay.com/illustrations/deer-polygon-poly-low-christmas-3219872/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-03.png',
            'https://pixabay.com/illustrations/deer-polygon-triangle-design-art-4056199/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-04.png',
            'https://pixabay.com/illustrations/deer-polygons-art-design-graphic-3275594/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-05.png',
            'https://pixabay.com/illustrations/dog-illustration-background-3275593/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-06.png',
            'https://pixabay.com/illustrations/dog-background-cute-pet-happy-3265713/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-07.png',
            'https://pixabay.com/illustrations/eagle-bird-nature-wild-nature-3271903/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-08.png',
            'https://pixabay.com/illustrations/giraffe-isolated-animal-background-3239743/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-09.png',
            'https://pixabay.com/illustrations/illustrator-triangle-low-poly-3253400/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-10.png',
            'https://pixabay.com/illustrations/illustrator-triangle-low-poly-3249914/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-11.png',
            'https://pixabay.com/illustrations/illustrator-triangle-low-poly-3242713/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-12.png',
            'https://pixabay.com/illustrations/leo-low-poly-triangles-animal-4961753/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-13.png',
            'https://pixabay.com/illustrations/low-poly-animal-vector-art-polygon-3305284/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-14.png',
            'https://pixabay.com/illustrations/poly-low-vector-geometric-3262202/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-15.png',
            'https://pixabay.com/illustrations/poly-low-vector-geometric-3259432/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-16.png',
            'https://pixabay.com/illustrations/poly-low-animal-vector-art-3295857/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-17.png',
            'https://pixabay.com/illustrations/poly-low-illustration-dog-animal-3275592/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-18.png',
            'https://pixabay.com/illustrations/poly-low-animal-vector-art-3295856/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-19.png',
            'https://pixabay.com/illustrations/poly-low-vector-geometric-3259233/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-20.png',
            'https://pixabay.com/illustrations/polygon-colorful-graphic-polygonal-3225500/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-21.png',
            'https://pixabay.com/illustrations/small-poly-animal-vector-art-3350170/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-22.png',
            'https://pixabay.com/illustrations/small-poly-animal-vector-art-3310321/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-23.png',
            'https://pixabay.com/illustrations/small-poly-animal-vector-art-3332791/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-24.png',
            'https://pixabay.com/illustrations/small-poly-animal-vector-art-3332792/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-25.png',
            'https://pixabay.com/illustrations/small-poly-animal-vector-art-3350169/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-26.png',
            'https://pixabay.com/illustrations/small-poly-animal-vector-art-3310320/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-27.png',
            'https://pixabay.com/illustrations/small-poly-animal-art-polygon-3298069/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-28.png',
            'https://pixabay.com/illustrations/small-poly-animal-vector-art-3310319/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-29.png',
            'https://pixabay.com/illustrations/small-poly-animal-vector-art-3350168/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
        new Credit(
            'pixabay',
            'https://pixabay.com/',
            '/images/profile-images/pi-30.png',
            'https://pixabay.com/illustrations/triangle-low-poly-abstract-3213782/',
            'Manuchi',
            'https://pixabay.com/users/manuchi-1728328/'
        ),
    ]

    /* Array of site image credits */
    const siteIconCredits = [
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/notif-error.png',
            'https://www.iconfinder.com/icons/299045/sign_error_icon',
            'Paomedia',
            'https://www.iconfinder.com/paomedia'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/notif-success.png',
            'https://www.iconfinder.com/icons/299110/check_sign_icon',
            'Paomedia',
            'https://www.iconfinder.com/paomedia'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/blogger.png',
            'https://www.iconfinder.com/icons/939738/blogger_icon',
            'Creative Hive',
            'https://www.iconfinder.com/flaticondesign'
        ),
        new Credit(
            'Iconfinder',
            'https://www.iconfinder.com/',
            '/images/site-images/github.png',
            'https://www.iconfinder.com/icons/939731/git_github_hub_icon_icon',
            'Creative Hive',
            'https://www.iconfinder.com/flaticondesign'
        )
    ]
    const siteImageCredits = [
        new Credit(
            'Unsplash',
            'https://unsplash.com/',
            '/images/site-images/mission-photo.jpg',
            'https://unsplash.com/photos/Q1p7bh3SHj8',
            'NASA',
            'https://unsplash.com/@nasa'
        ),
        new Credit(
            'Unsplash',
            'https://unsplash.com/',
            '/images/site-images/login-header-photo.jpg',
            'https://pixabay.com/photos/stars-rotation-night-sky-spin-3777573/',
            'draconianimages',
            'https://pixabay.com/users/draconianimages-182808/'
        ),
        new Credit(
            'Unsplash',
            'https://unsplash.com/',
            '/images/site-images/hero-image-scroll.jpg',
            'https://unsplash.com/photos/OqtafYT5kTw',
            'Ilya Pavlov',
            'https://unsplash.com/@ilyapavlov'
        ),
        new Credit(
            'Unsplash',
            'https://unsplash.com/',
            '/images/site-images/last-call-scroll.jpg',
            'https://unsplash.com/photos/iar-afB0QQw',
            'Markus Spiske',
            'https://unsplash.com/@markusspiske'
        ),
        new Credit(
            'Pixabay',
            'https://pixabay.com/',
            '/images/site-images/account-background.jpg',
            'https://pixabay.com/illustrations/blue-cubes-white-design-modern-2137334/',
            'PIRO4D',
            'https://pixabay.com/users/piro4d-2707530/'
        )
    ]

    /* Array of other credits */
    const otherCredits = [
        new Credit(
            'Highlight.js',
            'https://highlightjs.org/'
        ),
        new Credit(
            'Ace Editor',
            'https://ace.c9.io/'
        ),
        new Credit(
            'jQuery',
            'https://developers.google.com/speed/libraries/'
        ),
        new Credit(
            'Material Symbols',
            'https://fonts.google.com/icons?selected=Material+Symbols+Outlined'
        )
    ]

    res.render('legal/credits', {
        pageTitle: 'Image Credits',
        cardCredits: cardCredits,
        bgCredits: bgCredits,
        profileCredits: profileCredits,
        siteIconCredits: siteIconCredits,
        siteImageCredits: siteImageCredits,
        otherCredits: otherCredits
    })
}
