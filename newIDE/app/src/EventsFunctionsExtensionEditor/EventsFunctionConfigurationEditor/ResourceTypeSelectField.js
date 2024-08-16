// @flow
import { Trans } from '@lingui/macro';
import { I18n } from '@lingui/react';
import * as React from 'react';
import SelectField from '../../UI/SelectField';
import SelectOption from '../../UI/SelectOption';

type Props = {|
  value: number | string,
  // event and index should not be used, and be removed eventually
  onChange?: (
    event: {| target: {| value: string |} |},
    index: number,
    text: string
  ) => void,
  fullWidth?: boolean,
|};

export default function ResourceTypeSelectField({
  value,
  onChange,
  fullWidth,
}: Props) {
  return (
    <I18n>
      {({ i18n }) => (
        <SelectField
          floatingLabelText={<Trans>Resource type</Trans>}
          value={value}
          onChange={onChange}
          fullWidth={fullWidth}
        >
          <SelectOption key={'json'} value={'json'} label={'JSON'} />
          <SelectOption key={'audio'} value={'audio'} label={'Audio'} />
          <SelectOption key={'image'} value={'image'} label={'Image'} />
          <SelectOption key={'font'} value={'font'} label={'Font'} />
          <SelectOption
            key={'bitmapFont'}
            value={'bitmapFont'}
            label={'Bitmap font'}
          />
          <SelectOption key={'video'} value={'video'} label={'Video'} />
          <SelectOption key={'model3D'} value={'model3D'} label={'3D model'} />
          <SelectOption
            key={'tilemap'}
            value={'tilemap'}
            label={'Tile map (Tiled or LDtk)'}
          />
          <SelectOption
            key={'tileset'}
            value={'tileset'}
            label={'Tile set (Tiled)'}
          />
          <SelectOption key={'atlas'} value={'atlas'} label={'Atlas (Spine)'} />
          <SelectOption key={'spine'} value={'spine'} label={'Spine'} />
        </SelectField>
      )}
    </I18n>
  );
}
