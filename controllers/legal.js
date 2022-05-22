exports.getPrivacyPolicy = (req, res, next) => {
    res.render('legal/privacy-policy', {
        pageTitle: 'Privacy Policy',
    })
}

exports.getCredits = (req, res, next) => {
    const cardCredits = [
        {
            image: {
                localPath: '/images/site-images/card-images/javascript.png',
                remotePath: 'https://www.flaticon.com/free-icon/js_5968292'
            },
            source: {
                name: 'Flaticon',
                link: 'https://www.flaticon.com/'
            },
            author: {
                name: 'Freepik',
                link: 'https://www.flaticon.com/authors/freepik'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/angular.png',
                remotePath: 'https://www.iconfinder.com/icons/308433/angular_front-end_javascript_long_shadow_technologies_web_web_technology_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/css.png',
                remotePath: 'https://www.iconfinder.com/icons/308436/css_front-end_long_shadow_web_web_technology_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/github.png',
                remotePath: 'https://www.iconfinder.com/icons/308438/github_long_shadow_repository_web_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/html.png',
                remotePath: 'https://www.iconfinder.com/icons/308440/front-end_html_long_shadow_markup_language_technologies_web_web_technology_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/jquery.png',
                remotePath: 'https://www.iconfinder.com/icons/308442/front-end_javascript_jquery_js_library_long_shadow_web_web_technology_blue_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/nodejs.png',
                remotePath: 'https://www.iconfinder.com/icons/308444/javascrpt_js_library_long_shadow_nodejs_web_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/python.png',
                remotePath: 'https://www.iconfinder.com/icons/308445/long_shadow_python_script_language_web_web_technology_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/ruby.png',
                remotePath: 'https://www.iconfinder.com/icons/308447/back-end_long_shadow_programming_language_rails_ruby_web_web_technology_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/sass.png',
                remotePath: 'https://www.iconfinder.com/icons/308448/front-end_long_shadow_preprocesor_sass_web_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'the more',
                link: 'https://www.iconfinder.com/Jozef89'
            }
        },
        {
            image: {
                localPath: '/images/site-images/card-images/cpp.png',
                remotePath: 'https://www.iconfinder.com/icons/7564189/c_logo_plus_plus_plus_+_+_+_icon'
            },
            source: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/'
            },
            author: {
                name: 'Iconfinder',
                link: 'https://www.iconfinder.com/iconfinder'
            }
        },
    ]
    const bgCredits = [
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-01.png',
                remotePath: 'https://pixabay.com/vectors/abstract-background-beams-green-1294643/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'OpenClipart-Vectors',
                link: 'https://pixabay.com/users/openclipart-vectors-30363/'
            }
        }, // 01
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-02.png',
                remotePath: 'https://pixabay.com/vectors/abstract-background-colorful-1301930/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'GDJ',
                link: 'https://pixabay.com/users/gdj-1086657/'
            }
        }, // 02
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-03.png',
                remotePath: 'https://pixabay.com/vectors/abstract-art-paper-cutting-6994323/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'stocksbyrg',
                link: 'https://pixabay.com/users/stocksbyrg-19680236/'
            }
        }, // 03
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-04.png',
                remotePath: 'https://pixabay.com/vectors/abstract-art-colorful-background-6994321/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'stocksbyrg',
                link: 'https://pixabay.com/users/stocksbyrg-19680236/'
            }
        }, // 04
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-05.png',
                remotePath: 'https://pixabay.com/vectors/abstract-art-paper-cutting-6994330/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'stocksbyrg',
                link: 'https://pixabay.com/users/stocksbyrg-19680236/'
            }
        }, // 05
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-06.png',
                remotePath: 'https://pixabay.com/vectors/americana-abstract-graphic-mosaic-1512910/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Fotocitizen',
                link: 'https://pixabay.com/users/fotocitizen-397314/'
            }
        }, // 06
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-07.png',
                remotePath: 'https://pixabay.com/vectors/art-circle-abstract-background-7088315/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'satheeshsankaran',
                link: 'https://pixabay.com/users/satheeshsankaran-11196627/'
            }
        }, // 07
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-08.png',
                remotePath: 'https://pixabay.com/vectors/background-abstract-1503840/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'DavidRockDesign',
                link: 'https://pixabay.com/users/davidrockdesign-2595351/'
            }
        }, // 08
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-09.png',
                remotePath: 'https://pixabay.com/vectors/background-lines-shapes-1789175/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'DavidRockDesign',
                link: 'https://pixabay.com/users/davidrockdesign-2595351/'
            }
        }, // 09
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-10.png',
                remotePath: 'https://pixabay.com/vectors/triangles-polygon-color-pink-1430105/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'DavidRockDesign',
                link: 'https://pixabay.com/users/davidrockdesign-2595351/'
            }
        }, // 10
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-11.png',
                remotePath: 'https://pixabay.com/vectors/background-isometric-pattern-cubes-5126570/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'GDJ',
                link: 'https://pixabay.com/users/gdj-1086657/'
            }
        }, // 11
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-12.png',
                remotePath: 'https://pixabay.com/vectors/art-pattern-design-background-6689072/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 12
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-13.png',
                remotePath: 'https://pixabay.com/vectors/abstract-minimalist-wallpaper-6467846/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 13
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-14.png',
                remotePath: 'https://pixabay.com/vectors/background-abstract-geometric-6360867/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 14
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-15.png',
                remotePath: 'https://pixabay.com/vectors/abstract-minimalist-wallpaper-6467846/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 15
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-16.png',
                remotePath: 'https://pixabay.com/vectors/background-pattern-abstract-texture-6840278/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'stocksbyrg',
                link: 'https://pixabay.com/users/stocksbyrg-19680236/'
            }
        }, // 16
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-17.png',
                remotePath: 'https://pixabay.com/vectors/background-pattern-abstract-texture-6840279/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'stocksbyrg',
                link: 'https://pixabay.com/users/stocksbyrg-19680236/'
            }
        }, // 17
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-18.png',
                remotePath: 'https://pixabay.com/vectors/background-pattern-abstract-texture-6840283/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'stocksbyrg',
                link: 'https://pixabay.com/users/stocksbyrg-19680236/'
            }
        }, // 18
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-19.png',
                remotePath: 'https://pixabay.com/vectors/background-pattern-abstract-texture-6840285/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'stocksbyrg',
                link: 'https://pixabay.com/users/stocksbyrg-19680236/'
            }
        }, // 19
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-20.png',
                remotePath: 'https://pixabay.com/vectors/background-abstract-graphic-texture-7059487/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 20
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-21.png',
                remotePath: 'https://pixabay.com/vectors/colorful-prismatic-chromatic-2099182/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'GDJ',
                link: 'https://pixabay.com/users/gdj-1086657/'
            }
        }, // 21
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-22.png',
                remotePath: 'https://pixabay.com/vectors/hive-rhombuses-yellow-abstract-2002878/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'nena9002',
                link: 'https://pixabay.com/users/nena9002-2255518/'
            }
        }, // 22
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-23.png',
                remotePath: 'https://pixabay.com/vectors/modern-concept-template-art-6528732/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 23
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-24.png',
                remotePath: 'https://pixabay.com/vectors/mosaic-vector-tile-background-2821062/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Manuchi',
                link: 'https://pixabay.com/users/manuchi-1728328/'
            }
        }, // 24
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-25.png',
                remotePath: 'https://pixabay.com/vectors/stripes-modern-concept-template-6528728/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 25
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-26.png',
                remotePath: 'https://pixabay.com/vectors/stripes-modern-concept-template-6528731/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 26
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-27.jpg',
                remotePath: ''
            },
            source: {
                name: 'Vecteezy',
                link: 'https://www.vecteezy.com/'
            },
            author: {
                name: 'frik',
                link: 'https://www.vecteezy.com/members/frik'
            }
        }, // 27
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-28.png',
                remotePath: 'https://pixabay.com/vectors/art-pattern-design-background-6689070/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Azheer',
                link: 'https://pixabay.com/users/azheer-17448000/'
            }
        }, // 28
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-29.png',
                remotePath: 'https://pixabay.com/vectors/background-mesh-triangle-polygon-1430103/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'DavidRockDesign',
                link: 'https://pixabay.com/users/davidrockdesign-2595351/'
            }
        }, // 29
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-30.png',
                remotePath: 'https://pixabay.com/vectors/mesh-background-triangles-polygon-1430108/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'DavidRockDesign',
                link: 'https://pixabay.com/users/davidrockdesign-2595351/'
            }
        }, // 30
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-31.png',
                remotePath: 'https://pixabay.com/vectors/gradient-banner-circle-technology-7206609/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'satheeshsankaran',
                link: 'https://pixabay.com/users/satheeshsankaran-11196627/'
            }
        }, // 31
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-32.png',
                remotePath: 'https://pixabay.com/vectors/artwork-background-yellow-flow-3d-7169186/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'satheeshsankaran',
                link: 'https://pixabay.com/users/satheeshsankaran-11196627/'
            }
        }, // 32
        {
            image: {
                localPath: '/images/profile-backgrounds/bg-33.jpg',
                remotePath: 'https://pixabay.com/illustrations/the-polygon-hexagon-the-angular-1562743/'
            },
            source: {
                name: 'pixabay',
                link: 'https://pixabay.com/'
            },
            author: {
                name: 'Artturi_Mantysaari',
                link: 'https://pixabay.com/users/artturi_mantysaari-1625672/'
            }
        }, // 33
    ]

    res.render('legal/credits', {
        pageTitle: 'Image Credits',
        cardCredits: cardCredits,
        bgCredits: bgCredits,
    })
}