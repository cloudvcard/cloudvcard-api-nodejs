import * as https from 'http'

interface CVCResponse {
  result: any
  error: any
  token: string
  transactionid: string
}

export default class CloudVCard {
  private _version: string = '1.0.0'
  private _apihostname: string = 'api.cloudvcard.com'
  private _token: string

  public authorize(token: string) {
    return this.requestUrl('POST', 'authorization/authorize', {token: token})
    .then((result: CVCResponse) => {
      if (!result || !result.token) throw new Error('token missing')
      this._token = result.token
      return this._token
    })
  }

  public getVCard(ids: string[]) {
    if (!this._token) throw new Error('authentication required')
    if (!ids || ids.length < 1) throw new Error('ids missing')
    return this.requestUrl('GET', 'vcards/get?ids[]='+ ids.join('&ids[]='))
    .then((res: CVCResponse) => {
      return res.result
    })
  }

  private requestUrl(method: 'GET' | 'POST' | 'PUT', pagerequest: string, postdata?: any) {
    return new Promise((resolve: any, reject:any) => {
      let data: string = JSON.stringify(postdata)
      let options: any = {
        hostname: this._apihostname,
        port: 443,
        path: '/'+pagerequest,
        method: method,
        headers: {}
      }
      if (this._token) {
        options.headers['Authorization'] = 'Bearer ' + this._token
      }
      if (postdata) {
        options.headers['Content-Type'] = 'application/json'
        options.headers['Content-Length'] = data.length
      }
      const request = https.request(options, (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error('Failed to load page, status code: ' + response.statusCode))
        }
        const body: string[] = [];
        response.on('data', (chunk: string) => body.push(chunk))
        response.on('end', () => resolve(body.join('')))
      })
      if (data) request.write(data)
      request.on('error', (err) => reject(err))
      if (!data) request.end()
    })
    .then((result: string) => {
      return JSON.parse(result)
    })
    .catch((err) => {
      console.error(err)
    })
  }
}