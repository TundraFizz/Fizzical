from setuptools import setup, find_packages


requires = [
    "pyramid",
    "pyramid_jinja2",
    "waitress",
    ]

setup(name="fizzical",
      version="1.0",
      description="Short description here",
      long_description="Long description here",
      classifiers=[
          "Programming Language :: Python",
          "Framework :: Pyramid",
          "Topic :: Internet :: WWW/HTTP",
          "Topic :: Internet :: WWW/HTTP :: WSGI :: Application",
      ],
      author="",
      author_email="",
      url="",
      keywords="",
      packages=find_packages(),
      include_package_data=True,
      zip_safe=False,
      extras_require={},
      install_requires=requires,
      entry_points="""
      [paste.app_factory]
      main = fizzical:main
      """,
      )
