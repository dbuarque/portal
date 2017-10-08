sed "s/\%env\%/$1/g" dist/index.html.tmpl > index.html
aws s3 sync --acl public-read dist/ s3://$2
