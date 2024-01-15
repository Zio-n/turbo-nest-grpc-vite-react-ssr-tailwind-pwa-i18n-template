import { Controller, Get, Req, Res, Version } from '@nestjs/common';
import { AppService } from './app.service';
import { initialContentMap as iCM } from './global/backend.settings';
import { assetMap as aM } from './global/backend.settings';
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import App from "../../users-demo-frontend/src/App";
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  initialContentMap = { ...iCM, 'title': 'Welcome to demo Hello World!' }

  //localesRootPath = join(__dirname, '../../../..', 'demo-frontend','dist','locales');
  //initialI18nStore = dirTree(this.localesRootPath);


  assetMap = { ...aM, initialContentMap: this.initialContentMap }
  
  @Get('web*')
  @Version('1')//applies to v1
  getHelloWithSsrV1(@Req() req: Request, @Res() res: Response) {
    let assetMap = {
      ...this.assetMap,
      baseUrl: "/v1/web",
      initialContentMap: { ...this.initialContentMap, 'hello-message': this.appService.getHello() }
    } //override the base Url with req route since it could be influenced by version, etc.


    const entryPoint = [assetMap['main.js']];

    const { pipe, abort: _abort } = renderToPipeableStream(
      <StaticRouter location={req.url}>
        <App assetMap={assetMap} />
      </StaticRouter>,
      {
        bootstrapScriptContent: `window.assetMap = ${JSON.stringify(assetMap)};`,
        //bootstrapScripts: entryPoint,
        bootstrapModules: entryPoint,
        onShellReady() {
          res.statusCode = 200;
          res.setHeader("Content-type", "text/html");
          pipe(res);
        },
        onShellError() {
          res.statusCode = 500;
          res.send("<!doctype html><p>Loading...</p>");
        },
      }
    );
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }


}
