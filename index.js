const http = require('http');
const url = require('url');
const myAPIKey = process.env.myAPIKey;

const layoutStart = (`
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous">
    <div class='container container-sm p-5'>
`);

const layoutEnd = `</div>`;

const getFormWeather = () => (`
    <div class="row pt-3">
        <div class="col-auto">
            <form method="GET" action="/get-weather">
                <div class="mb-3">
                    <label for="city" class="form-label">Введите свой город:</label>
                    <input type="text" class="form-control" id="city" name="city" required>
                </div>
                <button type="submit" class="btn btn-primary">Узнать погоду</button>
            </form>
        </div>
    </div>
`);

const getInfoWeather = (data) => (`
    <div class="container-fluid px-1 px-md-4 py-5 mx-auto">
        <div class="row d-flex px-3">
            <div class="col">
                <div class="card" style="padding-left: 10px;">
                    <h2 class="ml-auto mr-4 mt-3 mb-0">${data.location.name}</h2>
                    <h1 class="ml-auto mr-4 large-font">${data.current.temperature}&#176;</h1>
                    <p class="ml-4 mb-4">${data.location.localtime}</p>
                </div>
                <div class="mt-2">
                    <a href="/" class="btn btn-primary">Вернуться на главную</a>
                </div>
            </div>
        </div>
    </div>
`);

const getInfoError = () => (`
    <div class="alert alert-danger" role="alert">
        Неверно указан город, попробуйте еще раз
    </div>
`);

const server = http.createServer((req, res) => {
    const urlParsed = url.parse(req.url, true)
    const { pathname, query } = urlParsed;
    // console.log(pathname, query);

    res.setHeader('Content-Type', 'text/html; charset=utf-8;');

    if (pathname === '/') {
        res.write(layoutStart);
        res.write('<h1>Weatherstack API</h1>');
        res.write(getFormWeather());
        res.write(layoutEnd);
        res.end();
    } else if (pathname === '/get-weather') {
        let url = `http://api.weatherstack.com/current?access_key=${myAPIKey}&query=${query.city}`;
        let data = '';

        http.get(url, resp => {
            resp
                .on('data', chunk => {
                    data += chunk;
                })
                .on('end', () => {
                    data = JSON.parse(data);

                    res.write(layoutStart);

                    if(data.error) {
                        res.write('<h1>Weatherstack API</h1>');
                        res.write(getFormWeather());
                        res.write(getInfoError());
                    } else {
                        res.write(getInfoWeather(data));
                    }

                    res.write(layoutEnd);
                    res.end();
                });
        }).on('error', e => {
            console.error(`Error: ${e.message}`);
        });
    }
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running, go to http://localhost:${process.env.PORT}/`)
});