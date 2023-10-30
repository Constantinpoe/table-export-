from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from google.protobuf import wrappers_pb2


def upload_offline_conversion(client, customer_id, conversion_action_id, gclid, conversion_value, conversion_date_time):
    conversion_upload_service = client.service.conversion_upload

    conversion = client.get_type('ClickConversion')
    conversion.conversion_action = client.service.conversion_action_service.conversion_action_path(customer_id,
                                                                                                   conversion_action_id)
    conversion.gclid = wrappers_pb2.StringValue(value=gclid)
    conversion.conversion_value = wrappers_pb2.DoubleValue(value=conversion_value)
    conversion.conversion_date_time = wrappers_pb2.StringValue(value=conversion_date_time)

    try:
        conversion_upload_response = conversion_upload_service.upload_click_conversions(
            customer_id=customer_id,
            conversions=[conversion],
            partial_failure=True
        )
        print('Conversion upload succeeded:')
        for result in conversion_upload_response.results:
            print(f'Uploaded conversion with resource name "{result.resource_name}"')
    except GoogleAdsException as ex:
        print('Conversion upload failed:')
        print(ex)


if __name__ == '__main__':
    client = GoogleAdsClient.load_from_storage('google-ads.yaml')

    customer_id = 'YOUR_CUSTOMER_ID'
    conversion_action_id = 'YOUR_CONVERSION_ACTION_ID'
    gclid = 'YOUR_GCLID'
    conversion_value = 1.0
    conversion_date_time = 'YYYY-MM-DD HH:MM:SS+HH:MM'

    upload_offline_conversion(client, customer_id, conversion_action_id, gclid, conversion_value, conversion_date_time)
