# README

## TODO

- Envia JSON com as novas fotos em intervalos definidos


## Comentários

- Usar [HAPI](http://hapijs.com/tutorials)

## API REST

- `GET /v1/timelapses`:
    {"timelapses": [
        {"id":"fpolis-20140601U123121"}
      ]
    }


- `GET /v1/timelapses/:id`:
    {
      id: 'fpolis-20140601U123121',
      name: 'Florianópolis',
      place: 'Florianópolis',
      startTime: '20140601U123121',
      endTime: '20140601U123121',
      lapse: 10000, //ms
      frames: 2000,
    }

- `GET /v1/timelapses/:id/photos?detailed=true`:
    {
       "id": "fpolis-20140601U123121",
       "name": "Florianópolis",
       "place": "Florianópolis",
       "startTime": "20140601U123121",
       "endTime": "20140601U123121",
       "lapse": 10000,
       "frames": 2000,
       "photos":
       [
           {
               "filename": "frame000.jpg",
               "width": 1280,
               "height": 720,
               "date": "2014-04-26T16:09:54.000Z",
               "frame": "000",
               //data: 'asdasd132qsad', //base64 //melhor usar o filename p/ compor path
           },
        ]
    }

- `GET /v1/timelapses/:id/photos?detailed=false`:
    {
       "id": "fpolis-20140601U123121",
       "name": "Florianópolis",
       "place": "Florianópolis",
       "startTime": "20140601U123121",
       "endTime": "20140601U123121",
       "lapse": 10000,
       "frames": 2000,
       "photos":
       [
           {
               "filename": "frame000.jpg",
               "frame": "000",
           },
        ]
    }

## API WebSocket

- Rascunho de atualização de arquivos:
    {
       "id": "fpolis-20140601U123121",
       "photos":
       [
           {
               "filename": "frame000.jpg",
               "frame": "000",
           },
        ]
    }



## FEITO

- OK: Varrer dir `/public/data/`, encontrar timelapses e alimentar 'GET /v1/timelapses' e 'GET /v1/timelapses/:id'.
- OK: Varrer dir `/public/data/:id/frames` e alimentar 'GET /v1/timelapses/:id/photos'.
- OK: Limpar código de arquivos modificados e commitar: "Implementado comportamento das rotas 'GET /v1/timelapses', 'GET /v1/timelapses/:id' e 'GET /v1/timelapses/:id/photos' (entregam JSON desejado)"
- OK: Varre diretório a cada modificação no mesmo
