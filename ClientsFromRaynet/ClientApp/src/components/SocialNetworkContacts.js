import React from 'react';

export function SocialNetworkContacts({ client }) {
  const socNetData = (!!client && client.socialNetworkContact) ?
    client.socialNetworkContact
    : {};

  return (
    <div className="row">
      <div className="col-sm-6 col-sm-offset-3 social-row">
        <div className={"icon-social icon-fb" + (socNetData.facebook ? ' icon-active' : '')}>
          {socNetData.facebook && <a href={socNetData.facebook}></a>}
        </div>
        <div className={"icon-social icon-twitter" + (socNetData.twitter ? ' icon-active' : '')}>
          {socNetData.twitter && <a href={socNetData.twitter}></a>}
        </div>
        <div className={"icon-social icon-linkedin" + (socNetData.linkedin ? ' icon-active' : '')}>
          {socNetData.linkedin && <a href={socNetData.linkedin}></a>}
        </div>
        <div className={"icon-social icon-pinterest" + (socNetData.pinterest ? ' icon-active' : '')}>
          {socNetData.pinterest && <a href={socNetData.pinterest}></a>}
        </div>
        <div className={"icon-social icon-instagram" + (socNetData.instagram ? ' icon-active' : '')}>
          {socNetData.instagram && <a href={socNetData.instagram}></a>}
        </div>
        <div className={"icon-social icon-skype" + (socNetData.skype ? ' icon-active' : '')}>
          {socNetData.skype && <a href={"skype:" + socNetData.skype + "?chat"}></a>}
        </div>
        <div className={"icon-social icon-yt" + (socNetData.youtube ? ' icon-active' : '')}>
          {socNetData.youtube && <a href={socNetData.youtube}></a>}
        </div>
      </div>
    </div>
  );
}