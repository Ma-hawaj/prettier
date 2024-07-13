export default async function printAngularLetDeclarations(
  textToDoc,
  print,
  path,
  options,
) {
  const { node } = path;

  const content = options.originalText.slice(
    node.sourceSpan.start.offset,
    node.sourceSpan.end.offset,
  );
  const isEmpty = /^\s*$/u.test(content);

  if (isEmpty) {
    return "";
  }

  const leftDoc = "@let";
  const operator = "=";
  const rightDoc = await textToDoc(node.value, {
    parser: "__js_expression",
  });

  return [leftDoc, operator, rightDoc];
}
