import CloudVCard from '../lib/cloudvcard'

const _ = (text?: string) => {
  console.log(text ? text : '')
}

const cvc = new CloudVCard()

_('---------- CloudVCard API Example ----------')
_(' 1) Authorize with API secret')
_()

cvc.authorize('93d4339a-db92-4ab8-80cb-3ae8cfa3cf43')
  .then((token: string) => {
    _('   Authenticated! - Returned:')
    _('   Bearer ' + token)
  })
  .then(() => {
    _()
    _()
    _(' 2) Triggering vcards/get for ID: 4f0d36ba-6466-46b1-935f-0c3d5cd40368')
    _()
  })
  .then(() => cvc.getVCard(["4f0d36ba-6466-46b1-935f-0c3d5cd40368"]))
  .then((vcardresult: any) => {
    _('   getVCard returned: ')
    _(JSON.stringify(vcardresult))
  })

  .then(() => {
    _()
    _('---------- CloudVCard API Example End ----------')
  })