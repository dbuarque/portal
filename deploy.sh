sed "s/\%env\%/$1/g" dist/index.html.tmpl > dist/index.html
aws s3 sync --profile lupoex --acl public-read dist/ s3://$2
