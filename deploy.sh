sed "s/\%env\%/$1/g" dist/index.html.tmpl > dist/index.html
aws s3 sync --delete --profile lupoex --acl public-read dist/ s3://$2
