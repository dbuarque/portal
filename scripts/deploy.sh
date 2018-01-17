sed "s/\%env\%/$1/g" dist/index.html.tmpl > dist/index.html
aws s3 sync --profile stellarport --acl public-read --delete dist/ s3://$2
aws s3 cp --profile stellarport --acl public-read --cache-control 'max-age=0' dist/index.html s3://$2/index.html
