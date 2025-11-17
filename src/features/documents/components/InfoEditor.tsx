import { Button } from '@/components';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { Document } from '@/models/Document';

interface Props {
  document: Document;
}

const InfoEditor = ({ document }: Props) => {
  return (
    <div className='bg-gray-50 dark:bg-gray-900 w-full p-5 border border-gray-200 dark:border-gray-700 rounded-2xl'>
      <form>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>Edit Information</FieldLegend>
            <FieldDescription>
              Edit all the document information
            </FieldDescription>
            <FieldGroup>
              <div className='grid md:grid-cols-2 gap-2'>
                <Field>
                  <FieldLabel htmlFor='checkout-7j9-card-name-43j'>
                    Document Title
                  </FieldLabel>
                  <Input
                    id='checkout-7j9-card-name-43j'
                    placeholder={document.title}
                    required
                  />
                </Field>
              </div>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator />
          <Field orientation='horizontal'>
            <Button type='submit'>Submit</Button>
            <Button type='button'>Cancel</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default InfoEditor;
