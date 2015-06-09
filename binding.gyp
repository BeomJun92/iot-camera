{
    "targets": [
        {
            "target_name": "camera",
            "sources": ["src/native/camera.cpp"],
            "link_settings": {
                "libraries": ["-lopencv_core", "-lopencv_highgui", "-lopencv_imgproc", "-lopencv_video", "-lopencv_ml"]
            },
            "cflags": [
                "-g", "-std=c++11", "-Wall"
            ],
            "conditions": [
                ['OS=="linux"', {
                    'include_dirs': [
                        '/usr/include'
                        ],
                    'link_settings': {
                        'library_dirs': ['/usr/share/lib']
                    },
                    'cflags!': ['-fno-exceptions'],
                    'cflags_cc!': ['-fno-rtti', '-fno-exceptions']
                }],
                ['OS=="mac"', {
                    'include_dirs': [
                        '/usr/local/include'
                        ],
                    'link_settings': {
                        'library_dirs': ['/usr/local/lib']
                    },
                    'xcode_settings': {
                        'OTHER_CFLAGS': [
                            "-mmacosx-version-min=10.7",
                            "-std=c++11",
                            "-stdlib=libc++"
                        ],
                        'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
                        'GCC_ENABLE_CPP_RTTI': 'YES'
                    }
                }]
            ]
    }
    ]
}